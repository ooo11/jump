// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

export type City = {
  id: string;
  name: string;
}

export type Category = {
  id: string;
  name: string;
}

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  city_id: string;
};

export type Vendor = {
  id: string;
  name: string;
  about: string;
  user_id: string;
  category_id: string;
}

export type VendorProfilePic = {
  id: string;
  image_url: string;
  vendor_id: string;
}

export type VendorLink = {
  id: string;
  name: string;
  url: string;
  vendor_id: string;
}

export type Package = {
  id: string;
  name: string;
  detail: string;
  vendor_id: string;
  image_url: string;
  price: number;
  features: string[];
}

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};



// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};


export type PackageForm = {
  id: string;
  name: string;
  detail: string;
  vendor_id: string;
  image_url: string;
  price: number;
  features: string[];
};

export type VendorForm = {
  id: string;
  name: string;
  about: string;
  user_id: string;
  category_id: string;
}

export type VendorProfilePicForm = {
  id: string;
  image_url: string;
  vendor_id: string;
}

export type VendorLinkForm = {
  id: string;
  name: string;
  url: string;
  vendor_id: string;
}


export type Posts = {
  [x: string]: any;
  id: string;
  name: string;
  detail: string;
  image_url: string;
  vendor_id: string;
};

export type Tags = {
  id: string;
  name: string;
};

export type PostTags = {
  id: string;
  post_id: string;
  tag_id: string;
};

export type PostForm = {
  id: string;
  name: string;
  detail: string;
  image_url: string;
  vendor_id: string;
};

export type Day = {
  id: string;
  name: string;
  dayOfWeek: number; // @see getDay() documentation, 0 for Sunday, 1 for Monday, ...
  openTime: string;
  closeTime: string;
};

export type Jumpers = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city_id: string;
};

export type Orders = {
  id: string;
  package_id: string;
  jumper_id: string;
  datetime: string;
  submittime: string;
  status: 'pending payment' | 'paid' | 'accepted' | 'decline' | 'delivered' | 'pending work' | 'complete' | 'incomplete' | 'release payment' | 'report issue' | 'cancelled';
};

export type latestOrders = {
  id: string;
  name: string;
  email: string;
  phone: string;
  price: number;
  datetime: string;
  status: 'pending payment' | 'paid' | 'accepted' | 'decline' | 'delivered' | 'pending work' | 'complete' | 'incomplete' | 'release payment' | 'report issue' | 'cancelled';
};

export type orderStatus = {
  some: any;
  id: string;
  status: 'pending payment' | 'paid' | 'accepted' | 'decline' | 'delivered' | 'pending work' | 'complete' | 'incomplete' | 'release payment' | 'report issue' | 'cancelled';
};

export type vendorURL = {
  id: string;
  url: string;
  vendor_id: string;
};

export type vendorSingleUrl = {
  url: string;
};

export type VendorPageData = {
  id: string;
  url: string;
  name: string;
  about: string;
  category: string;
  city: string;
  vendorImageUrl: string;
}