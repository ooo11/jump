import { vendorId } from './config';
'use server';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

import { z } from 'zod';
import { QueryResult, QueryResultRow, sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
const bcrypt = require('bcrypt');

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);


const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});


const VendorOrderFormSchema = z.object({
  id: z.string(),
  package_id: z.string(),
  jumper_id: z.string(),
  datetime: z.string(),
  submittime: z.string(),
  status: z.enum(['accepted', 'decline', 'incomplete', 'delivered'], {
    invalid_type_error: 'Please select a status.',
  }),
  vendor_id: z.string(),

});

const AdminOrderFormSchema = z.object({
  id: z.string(),
  package_id: z.string(),
  jumper_id: z.string(),
  datetime: z.string(),
  submittime: z.string(),
  status: z.enum(['pending payment', 'paid', 'accepted', 'decline', 'delivered', 'pending work', 'complete', 'incomplete', 'release payment', 'report issue', 'cancelled'], {
    invalid_type_error: 'Please select a status.',
  })

});


//Schema for packageForm
//Dosent parse the data becoue whats here need to be parse first then output : success. 
const PackageFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  detail: z.string(),
  vendor_id: z.string(),
  image_url: z.string(),
  price: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  features: z.any()
});



//Schema for postForm
const PostsFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  detail: z.string(),
  vendor_id: z.string(),
  image_url: z.string(),
});

//Schema for vendorForm
const VendorSchema = z.object({
  id: z.string(),
  name: z.string(),
  about: z.string(),
  user_id: z.string(),
  category_id: z.string(),
  image_url: z.string(),
  url: z
    .string()
    .trim()
    .min(4, { message: "Must be 4 or more characters long" })
    .max(100, { message: "Must be 100 or fewer characters long" })
    .refine((value) => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value ?? ""), 'Name should contain only alphabets')

});



//Schema for userForm
const JumperSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().regex(phoneRegex, 'Invalid Phone Number!').min(9, { message: "Must be 9 or more characters long" }).startsWith("01"),
  city_id: z.string(),
  jumper_id: z.string(),
  package_id: z.string(),
  datetime: z.string(),
  submittime: z.string(),
  status: z.enum(['order placed', 'payment done', 'job acceptance', 'job done', 'completion'], {
    invalid_type_error: 'Please select an order status.',
  }),
  url: z.string(),
});



const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

//things to omit from the form so that its the same.
const CreatePackages = PackageFormSchema.omit({ id: true });
const UpdatePackages = PackageFormSchema.omit({ id: true });

//things to omit from the form so that its the same.
const CreatePosts = PostsFormSchema.omit({ id: true });
const UpdatePosts = PostsFormSchema.omit({ id: true, vendor_id: true });

//things to omit from the form so that its the same.
const CreateVendors = VendorSchema.omit({ id: true });
const UpdateVendors = VendorSchema.omit({ id: true, user_id: true });


//things to omit from the form so that its the same.
const CreateJumpers = JumperSchema.omit({ id: true, jumper_id: true, submittime: true, status: true });
const UpdateJumpers = JumperSchema.omit({ id: true });

//things to omit from the form so that its the same.
const CreateVendorOrder = VendorOrderFormSchema.omit({ id: true });
const UpdateVendorOrder = VendorOrderFormSchema.omit({ id: true, package_id: true, jumper_id: true, submittime: true, datetime: true });

const CreateAdminOrder = AdminOrderFormSchema.omit({ id: true });
const UpdateAdminOrder = AdminOrderFormSchema.omit({ id: true, package_id: true, jumper_id: true, submittime: true, datetime: true });


export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};



export type PackageState = {
  errors?: {
    name?: string[];
    detail?: string[];
    // image_url?: string[];
    price?: string[];
    // features?: string[];
    vendor_id?: string[];
  };
  message?: string | null;
};

export type PostState = {
  errors?: {
    name?: string[];
    detail?: string[];
    image_url?: string[];
  };
  message?: string | null;
};

export type VendorState = {
  errors?: {
    name?: string[];
    about?: string[];
    userId?: string[];
    categoryId?: string[];
    image_url?: string[];
    url?: string[];
  };
  message?: string | null;
};



export type JumperState = {
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    city_id?: string[];
    // jumper_id: string[];
    package_id?: string[];
    datetime?: string[];
    // submittime: string[];
    status?: string[];
    url?: string[];
  };
  message?: string | null;
};



export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
          INSERT INTO invoices (customer_id, amount, status, date)
          VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  };
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  // If form validation fails, return errors early. Otherwise, continue.
  //if no data enter -> return error, supposed if no data = existing data is input

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };

  }

  const { customerId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');

}

export async function deleteInvoice(id: string) {

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: `Deleted Invoice id user ${id}` };

  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete Invoice.',
    };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}



//create package
export async function createPackages(prevState: PackageState, formData: FormData) {
  const validatedFields = CreatePackages.safeParse({
    name: formData.get('name'),
    detail: formData.get('detail'),
    vendor_id: formData.get('vendor_id'),
    image_url: formData.get('image_url'),
    price: formData.get('price'),
    features: formData.get('features'),

  });


  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Packages.',
    };
  }

  // Prepare data for insertion into the database
  const { name, detail, vendor_id, image_url, price, features } = validatedFields.data;
  const priceInCents = price * 100;

  //todo can upload image store to s3, get url here
  const thisObj = features.split(',').map((item: string) => item.trim());

  try {
    await sql`
          INSERT INTO packages (name, detail, vendor_id, image_url, price, features)
          VALUES (${name}, ${detail}, ${vendor_id}, ${image_url}, ${priceInCents}, ${thisObj})
        `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Packages.',
    };
  };
  revalidatePath(`/dashboard/${vendor_id}`);
  redirect(`/dashboard/${vendor_id}`);
}



//update Packages
export async function updatePackages(id: string, prevState: PackageState, formData: FormData) {
  const validatedFields = UpdatePackages.safeParse({
    name: formData.get('name'),
    detail: formData.get('detail'),
    image_url: formData.get('image_url'),
    price: formData.get('price'),
    features: formData.get('features'),
    vendor_id: formData.get('vendor_id')
  });



  // If form validation fails, return errors early. Otherwise, continue.
  //if no data enter -> return error, supposed if no data = existing data is input

  if (!validatedFields.success) {
    // console.log("Error on success");
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Packages.',
    };

  }

  const { name, detail, image_url, price, features, vendor_id } = validatedFields.data;
  // const { name, detail, image_url, price } = validatedFields.data;


  const priceInCents = price * 100;

  // //todo can upload image store to s3, get url here


  const thisObj = features.split(',').map((item: string) => item.trim());




  try {
    await sql`
      UPDATE packages
      SET name = ${name}, detail = ${detail}, image_url = ${image_url}, price = ${priceInCents}, features= ${thisObj}
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Packages.',
    };
  }

  revalidatePath(`/dashboard/${vendor_id}`);
  redirect(`/dashboard/${vendor_id}`);

}

//delete packages [ok]

export async function deletePackages(id: string) {

  try {
    await sql`DELETE FROM packages WHERE id = ${id}`;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete Packages.',
    };
  }
  revalidatePath('/dashboard');
  redirect('/dashboard');
}








// id: string;
// name: string;
// about: string;
// user_id: string;
// category_id: string;


//update Vendor
export async function updateVendor(id: string, prevState: VendorState, formData: FormData) {
  const validatedFields = UpdateVendors.safeParse({
    name: formData.get('name'),
    about: formData.get('about'),
    category_id: formData.get('category_id'),
    image_url: formData.get('image_url'),
    url: formData.get('url')
  });


  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Packages.',
    };

  }

  const { name, about, category_id, image_url, url } = validatedFields.data;



  try {
    await sql`
      UPDATE vendors
      SET name = ${name}, about = ${about}, category_id = ${category_id}
      WHERE id = ${id}
    `;
    await sql`
    UPDATE vendorprofilepic
    SET image_url = ${image_url}
    WHERE vendor_id = ${id}
    `;

    await sql`
    UPDATE vendorurl
    SET url = ${url}
    WHERE vendor_id = ${id}
    AND NOT EXISTS (SELECT 1 FROM vendorurl WHERE url = ${url})
    `;


  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Vendors.',
    };
  }

  revalidatePath(`/dashboard/${id}`);
  redirect(`/dashboard/${id}`);

}

//create jumpers and orders to database 
export async function createJumper(prevState: JumperState, formData: FormData) {
  const validatedFields = CreateJumpers.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    city_id: formData.get('city_id'),
    package_id: formData.get('package_id'),
    datetime: formData.get('datetime'),
    url: formData.get('url')
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create New User.',
    };
  }

  // Prepare data for insertion into the database
  const { name, email, phone, city_id, package_id, datetime, url } = validatedFields.data;

  const submittime = new Date().toISOString(); // insert submitted time

  const defaultStatus = 'pending payment'

  try {
    const jumperResult = await sql`
    INSERT INTO jumpers (name, email, phone, city_id)
    VALUES (${name}, ${email}, ${phone}, ${city_id})
    RETURNING id;`;

    const jumper_id: string = (jumperResult as QueryResult<QueryResultRow & { id: string }>).rows[0].id;

    await sql`
    INSERT INTO orders (jumper_id, package_id, datetime, submittime, status)
    VALUES (${jumper_id}, ${package_id}, ${datetime}, ${submittime}, ${defaultStatus});
  `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create New User.',
    };
  };


  revalidatePath(`/${url}/success`);
  redirect(`/${url}/success`);
}


export async function updateOrderStatus(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateVendorOrder.safeParse({
    status: formData.get('status'),
    vendor_id: formData.get('vendor_id'),
  });
  // If form validation fails, return errors early. Otherwise, continue.
  //if no data enter -> return error, supposed if no data = existing data is input

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };

  }

  const { status, vendor_id } = validatedFields.data;


  try {
    await sql`
      UPDATE orders
      SET status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Invoice.',
    };
  }

  revalidatePath(`/dashboard/${vendor_id}/orders`);
  redirect(`/dashboard/${vendor_id}/orders`);

}

export async function updateAdminOrderStatus(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateAdminOrder.safeParse({
    status: formData.get('status'),
  });
  // If form validation fails, return errors early. Otherwise, continue.
  //if no data enter -> return error, supposed if no data = existing data is input

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };

  }

  const { status } = validatedFields.data;


  try {
    await sql`
      UPDATE orders
      SET status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Invoice.',
    };
  }

  revalidatePath('/dashboard/admin/orders');
  redirect('/dashboard/admin/orders');

}


export async function deleteOrderAdmin(id: string) {

  try {
    await sql`DELETE FROM orders WHERE id = ${id}`;
    revalidatePath('/dashboard/admin/order');
    return { message: `Deleted Order id ${id}` };

  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete Order.',
    };
  }
}