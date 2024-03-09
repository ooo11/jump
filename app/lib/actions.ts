'use server';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
const bcrypt = require('bcrypt');


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
});


//Schema for vendorLinkForm
const VendorLinkSchema = z.object({
  id: z.string(),
  name: z.string(),
  linkURL: z.string().url().or(z.literal("")),
});

//Schema for userForm
const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  password: z.string(),
  city_id: z.string(),
});



const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

//things to omit from the form so that its the same.
const CreatePackages = PackageFormSchema.omit({ id: true });
const UpdatePackages = PackageFormSchema.omit({ id: true, vendor_id: true });

//things to omit from the form so that its the same.
const CreatePosts = PostsFormSchema.omit({ id: true });
const UpdatePosts = PostsFormSchema.omit({ id: true, vendor_id: true });

//things to omit from the form so that its the same.
const CreateVendors = VendorSchema.omit({ id: true });
const UpdateVendors = VendorSchema.omit({ id: true, user_id: true });

//things to omit from the form so that its the same.
const CreateVendorLinks = VendorLinkSchema.omit({ id: true });
const UpdateVendorLinks = VendorLinkSchema.omit({ id: true, name: true });

//things to omit from the form so that its the same.
const CreateUsers = UserSchema.omit({ id: true });
const UpdateUsers = UserSchema.omit({ id: true });

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
  };
  message?: string | null;
};

export type VendorLinkState = {
  errors?: {
    linkURL?: string[];
  };
  message?: string | null;
};


export type UserState = {
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    password?: string[];
    city_id?: string[];
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
  console.log(validatedFields);

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
  revalidatePath('/dashboard');
  redirect('/dashboard');
}



//update Packages
export async function updatePackages(id: string, prevState: PackageState, formData: FormData) {
  const validatedFields = UpdatePackages.safeParse({
    name: formData.get('name'),
    detail: formData.get('detail'),
    image_url: formData.get('image_url'),
    price: formData.get('price'),
    features: formData.get('features'),
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

  const { name, detail, image_url, price, features } = validatedFields.data;
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

  revalidatePath('/dashboard');
  redirect('/dashboard');

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


//create Posts
export async function createPosts(prevState: PostState, formData: FormData) {
  const validatedFields = CreatePosts.safeParse({
    name: formData.get('name'),
    detail: formData.get('detail'),
    vendor_id: formData.get('vendor_id'),
    image_url: formData.get('image_url'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Posts.',
    };
  }

  // Prepare data for insertion into the database
  const { name, detail, vendor_id, image_url } = validatedFields.data;


  try {
    await sql`
          INSERT INTO posts (name, detail, vendor_id, image_url)
          VALUES (${name}, ${detail}, ${vendor_id}, ${image_url})
        `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Posts.',
    };
  };
  revalidatePath('/dashboard/portfolio');
  redirect('/dashboard/portfolio');
}



//update Posts
export async function updatePosts(id: string, prevState: PostState, formData: FormData) {
  const validatedFields = UpdatePosts.safeParse({
    name: formData.get('name'),
    detail: formData.get('detail'),
    image_url: formData.get('image_url'),
  });



  // If form validation fails, return errors early. Otherwise, continue.
  //if no data enter -> return error, supposed if no data = existing data is input

  if (!validatedFields.success) {
    // console.log("Error on success");
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Posts.',
    };

  }

  const { name, detail, image_url } = validatedFields.data;

  try {
    await sql`
      UPDATE posts
      SET name = ${name}, detail = ${detail}, image_url = ${image_url}
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Posts.',
    };
  }

  revalidatePath('/dashboard/portfolio');
  redirect('/dashboard/portfolio');

}

//delete posts

export async function deletePosts(id: string) {

  try {
    await sql`DELETE FROM posts WHERE id = ${id}`;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete posts.',
    };
  }
  revalidatePath('/dashboard/portfolio');
  redirect('/dashboard/portfolio');
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
  });

  console.log('Form Data for update vendor:', validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Packages.',
    };

  }

  const { name, about, category_id, image_url } = validatedFields.data;



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


  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Vendors.',
    };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');

}

//create User
export async function createUser(prevState: UserState, formData: FormData) {
  const validatedFields = CreateUsers.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    password: formData.get('password'),
    city_id: formData.get('city_id'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create New User.',
    };
  }

  // Prepare data for insertion into the database
  const { name, email, phone, password, city_id } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);



  try {
    await sql`
          INSERT INTO users (name, email, phone, password, city_id)
          VALUES (${name}, ${email}, ${phone}, ${hashedPassword}, ${city_id})
        `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create New User.',
    };
  };


  revalidatePath(`/guest/profile`);
  redirect(`/guest/profile`);
}
