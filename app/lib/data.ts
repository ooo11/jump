import { vendorId } from './config';
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
  PostTags,
  VendorProfilePic,
  VendorLink,
  Orders,
  latestOrders,
  orderStatus,
  VendorPageData,
  vendorURL,
  vendorSingleUrl

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
        *
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

export async function fetchPackageByVendorURL(url: string) {

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
      JOIN vendorURL ON packages.vendor_id = vendorURL.vendor_id
      WHERE vendorURL.url = ${url};
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

export async function fetchVendorProfilePicById(id: string) {

  noStore();

  try {
    const data = await sql<VendorProfilePic>`
      SELECT
        *
      FROM vendorprofilepic
      WHERE vendorprofilepic.vendor_id = ${id};
    `;

    const profilepic = data.rows[0];
    return profilepic;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch profilepic.');
  }
};


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

export async function fetchCategory() {
  noStore();

  try {
    const data = await sql<Category>`
      SELECT
        id,
        name
      FROM categories
      ORDER BY name ASC
    `;

    const categories = data.rows;
    return categories;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all categories.');
  }
}

export async function fetchCity() {
  noStore();

  try {
    const data = await sql<City>`
      SELECT
        id,
        name
      FROM cities
      ORDER BY name ASC
    `;
    const cities = data.rows;
    return cities;
  } catch (error) {
    console.error('Failed to fetch city:', error);
    throw new Error('Failed to fetch city.');
  }
}

export async function fetchLatestOrders() {
  noStore();

  try {
    const data = await sql<latestOrders>`
      SELECT orders.id, jumpers.name, jumpers.email, jumpers.phone, packages.price, orders.datetime, orders.status
      FROM orders
      JOIN jumpers ON orders.jumper_id = jumpers.id
      JOIN packages ON orders.package_id = packages.id
      ORDER BY orders.submittime DESC
      LIMIT 5`;

    const latestOrders = data.rows.map((order) => ({
      ...order,
      price: formatCurrency(order.price),
    }));
    return latestOrders;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}


export async function fetchFilteredOrders(
  query: string,
  currentPage: number,
  vendorId: string
) {
  noStore();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const orders = await sql<latestOrders>`
      SELECT
        orders.id,
        orders.datetime,
        orders.status,
        jumpers.name,
        jumpers.email,
        jumpers.phone,
        packages.price
      FROM orders
      JOIN jumpers ON orders.jumper_id = jumpers.id
      JOIN packages ON orders.package_id = packages.id
      WHERE
        (jumpers.name ILIKE ${`%${query}%`} OR
        jumpers.email ILIKE ${`%${query}%`} OR
        jumpers.phone ILIKE ${`%${query}%`} OR
        packages.price::text ILIKE ${`%${query}%`} OR
        orders.datetime::text ILIKE ${`%${query}%`} OR
        orders.status ILIKE ${`%${query}%`})
        AND packages.vendor_id = ${vendorId}
      ORDER BY orders.submittime DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return orders.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch orders.');
  }
}


export async function fetchOrdersPages(query: string, vendorId: string) {
  noStore();

  try {
    const count = await sql`SELECT COUNT(*)
    FROM orders
    JOIN jumpers ON orders.jumper_id = jumpers.id
    JOIN packages ON orders.package_id = packages.id
    WHERE
      (jumpers.name ILIKE ${`%${query}%`} OR
      jumpers.email ILIKE ${`%${query}%`} OR
      jumpers.phone ILIKE ${`%${query}%`} OR
      packages.price::text ILIKE ${`%${query}%`} OR
      orders.datetime::text ILIKE ${`%${query}%`} OR
      orders.status ILIKE ${`%${query}%`})
      AND packages.vendor_id = ${vendorId}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of orders.');
  }
}

export async function fetchOrderById(id: string) {

  noStore();

  try {
    const data = await sql<latestOrders>`
      SELECT
      orders.id,
      orders.datetime,
      orders.status,
      jumpers.name,
      jumpers.email,
      jumpers.phone,
      packages.price
    FROM orders
    JOIN jumpers ON orders.jumper_id = jumpers.id
    JOIN packages ON orders.package_id = packages.id
      WHERE orders.id = ${id};
    `;

    const order = data.rows.map((order) => ({
      ...order,
      // Convert amount from cents to dollars
      price: order.price / 100,
    }));
    // console.log(invoice);
    return order[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch order based on id.');
  }
}


export async function fetchJumpers() {
  noStore();

  try {
    const data = await sql<CustomerField>`
      SELECT
        *
      FROM jumpers
      ORDER BY name ASC
    `;

    const jumpers = data.rows;
    return jumpers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all jumpers.');
  }
}

// export async function fetchStatusOrder(id: string) {
//   noStore();

//   try {
//     const data = await sql<orderStatus>`
//       SELECT
//         id,
//         status
//       FROM orders
//       JOIN packages ON orders.package_id = packages.id
//       WHERE packages.vendor_id = ${id};
//     `;

//     const orders = data.rows;
//     return orders;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all order status.');
//   }
// };

export async function fetchVendorByURL(url: string) {

  noStore();

  try {
    const data = await sql<VendorPageData>`
      SELECT
      vendorURL.id AS id,
      vendorURL.url AS url,
      vendors.name AS name,
      vendors.about AS about,
      categories.name AS category,
      cities.name AS city,
      vendorprofilepic.image_url AS vendorImageUrl
    FROM vendorURL
    JOIN vendors ON vendorURL.vendor_id = vendors.id
    JOIN categories ON vendors.category_id = categories.id
    JOIN users ON vendors.user_id = users.id
    JOIN cities ON users.city_id = cities.id
    JOIN vendorprofilepic ON vendorURL.vendor_id = vendorprofilepic.vendor_id
    WHERE vendorURL.url = ${url};
    `;

    const vendor = data.rows[0];
    return vendor;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to vendor based on url.');
  }
}


export async function fetchVendorProfilePicByURL(url: string) {
  noStore();

  try {
    // Find the vendor ID based on the URL
    const vendorIdQuery = await sql<vendorURL>`
      SELECT
        vendor_id
      FROM vendorURL
      WHERE url = ${url};
    `;
    const vendorId = vendorIdQuery.rows[0]?.vendor_id;

    if (!vendorId) {
      throw new Error('Vendor not found for the given URL.');
    }

    // Fetch the profile picture using the vendor ID
    const data = await sql<VendorProfilePic>`
      SELECT
        *
      FROM vendorprofilepic
      WHERE vendor_id = ${vendorId};
    `;

    if (!data) {
      throw new Error('VendorPicData not found for the given URL.');
    }

    const profilepic = data.rows[0];
    return profilepic;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch profilepic.');
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

export async function fetchOrdersByVendorId(vendorId: string) {
  noStore();

  try {
    // Find the package IDs associated with the provided vendor ID
    const packageIdsQuery = await sql<Package>`
      SELECT
        id
      FROM packages
      WHERE vendor_id = ${vendorId};
    `;
    const packageIds = packageIdsQuery.rows.map(row => `'${row.id}'`);

    if (!packageIds.length) {
      throw new Error('No packages found for the given vendor ID.');
    }

    // Concatenate packageIds with commas and surround with parentheses
    const packageIdsString = `(${packageIds.join(', ')})`;
    console.log("packageIdsString", packageIdsString);

    // Fetch orders corresponding to the package IDs
    const ordersQuery = await sql<orderStatus>`
      SELECT
        id,
        status
      FROM orders
      WHERE package_id IN ${packageIdsString};
    `;

    console.log("THis is the ordersQuery", ordersQuery);


    if (!ordersQuery) {
      throw new Error('ordersQuery not found for the given vendor_id.');
    }

    const orders = ordersQuery.rows;
    return orders;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch orders.');
  }
}
export async function fetchOrdersByPackageId(packageIds: string[]) {
  noStore();

  try {

    const packageIdsString = `(${packageIds.join(', ')})`;
    // Fetch orders corresponding to the package IDs
    const ordersQuery = await sql<orderStatus>`
      SELECT
        id,
        status
      FROM orders
      WHERE package_id IN ${packageIdsString};
    `;


    if (!ordersQuery) {
      throw new Error('ordersQuery not found for the given vendor_id.');
    }

    const orders = ordersQuery.rows;
    return orders;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch orders.');
  }
}

export async function fetchVendorUrlById(id: string) {
  noStore();

  try {
    const data = await sql<vendorSingleUrl>`
    SELECT
    url
  FROM vendorurl
  WHERE vendorurl.vendor_id = ${id};
    `;
    const urls = data.rows[0];
    return urls;
  } catch (error) {
    console.error('Failed to fetch url:', error);
    throw new Error('Failed to fetch url.');
  }
}