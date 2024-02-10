import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
  Vendor,
  Package,
  PackageForm,
  City,
  Category,
  Posts,
  Tags,
  PostTags

} from './definitions';
import { formatCurrency } from './utils';

export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  noStore();

  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();

  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

//this is how pagination
const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();

  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {

  noStore();

  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));
    // console.log(invoice);
    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  noStore();

  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore();

  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function getUser(email: string) {
  noStore();

  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getAllVendors() {
  noStore();

  try {
    const data = await sql<Vendor>`
      SELECT
        id,
        name
      FROM vendors
      ORDER BY name ASC
    `;

    const vendors = data.rows;
    return vendors;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all vendors.');
  }
}

export async function getAllPackages() {
  noStore();

  try {
    const data = await sql<Package>`
      SELECT
        packages.id,
        packages.name,
        packages.detail,
        packages.vendor_id,
        packages.image_url,
        packages.price,
        packages.features
      FROM packages
      ORDER BY name ASC
    `;

    const packages = data.rows;
    return packages;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all packages.');
  }
}

export async function fetchPackageByVendorId(id: string) {

  noStore();

  try {
    const data = await sql<PackageForm>`
      SELECT
        packages.id,
        packages.name,
        packages.detail,
        packages.vendor_id,
        packages.image_url,
        packages.price,
        packages.features
      FROM packages
      WHERE packages.vendor_id = ${id};
    `;

    const pack = data.rows.map((pack) => ({
      ...pack,
      // Convert amount from cents to dollars
      price: pack.price / 100,
    }));
    // console.log(pack);
    return pack;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch package.');
  }
}

export async function fetchPackageById(id: string) {

  noStore();

  // id: string;
  // name: string;
  // detail: string;
  // vendor_id: string;
  // image_url: string;
  // price: number;
  // features: string;

  try {
    const data = await sql<PackageForm>`
      SELECT
        packages.id,
        packages.name,
        packages.detail,
        packages.vendor_id,
        packages.image_url,
        packages.price,
        packages.features
      FROM packages
      WHERE packages.id = ${id};
    `;

    const pack = data.rows.map((pack) => ({
      ...pack,
      // Convert amount from cents to dollars
      price: pack.price / 100,
    }));
    // console.log(pack);
    return pack[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch package.');
  }
}



export async function fetchVendorById(id: string) {

  noStore();

  try {
    const data = await sql<Vendor>`
      SELECT
        *
      FROM vendors
      WHERE vendors.id = ${id};
    `;

    const vendor = data.rows[0];
    return vendor;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch vendor.');
  }
}

export async function fetchVendorByUserId(id: string) {

  noStore();

  try {
    const data = await sql<Vendor>`
      SELECT
        *
      FROM vendors
      WHERE vendors.user_id = ${id};
    `;

    const vendor = data.rows[0];
    return vendor;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch vendor.');
  }
}

export async function getUserbyId(id: string) {
  noStore();

  try {
    const user = await sql`SELECT * FROM users WHERE id=${id}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getCitybyId(id: string) {
  noStore();

  try {
    const city = await sql`SELECT * FROM cities WHERE id=${id}`;
    return city.rows[0] as City;
  } catch (error) {
    console.error('Failed to fetch city:', error);
    throw new Error('Failed to fetch city.');
  }
}

export async function getCategorybyId(id: string) {
  noStore();

  try {
    const category = await sql`SELECT * FROM categories WHERE id=${id}`;
    return category.rows[0] as Category;
  } catch (error) {
    console.error('Failed to fetch category:', error);
    throw new Error('Failed to fetch category.');
  }
}

export async function fetchPostByVendorId(id: string) {

  noStore();

  try {
    const data = await sql<Posts>`
      SELECT
       *
      FROM posts
      WHERE posts.vendor_id = ${id};
    `;

    const posts = data.rows;
    return posts;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch package.');
  }
}

export async function fetchPostById(id: string) {

  noStore();


  try {
    const data = await sql<Posts>`
      SELECT
        *
      FROM posts
      WHERE posts.id = ${id};
    `;

    const post = data.rows[0];
    return post;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch package.');
  }
}
