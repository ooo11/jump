const { db } = require('@vercel/postgres');
const {
  invoices,
  customers,
  revenue,
  users,
  vendors,
  cities,
  categories,
  packages,
  tags,
  posts,
  postsTags,
  vendorprofilepic,
  jumpers,
  orders,
  vendorURL
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');


async function seedCities(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "cities" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS cities (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "cities" table`);

    // Insert data into the "cities" table
    const insertedCities = await Promise.all(
      cities.map(
        (city) => client.sql`
        INSERT INTO cities (id, name)
        VALUES (${city.id}, ${city.name})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedCities.length} cities`);

    return {
      createTable,
      cities: insertedCities,
    };
  } catch (error) {
    console.error('Error seeding cities:', error);
    throw error;
  }
};

async function seedCategories(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "categories" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "categories" table`);

    // Insert data into the "categories" table
    const insertedCategories = await Promise.all(
      categories.map(
        (category) => client.sql`
        INSERT INTO categories (id, name)
        VALUES (${category.id}, ${category.name})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedCategories.length} categories`);

    return {
      createTable,
      categories: insertedCategories,
    };
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
};



async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        city_id UUID NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, phone,  password, city_id)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${user.phone}, ${hashedPassword},${user.city_id})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedVendors(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "vendors" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS vendors (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        about TEXT NOT NULL,
        user_id UUID NOT NULL,
        category_id UUID NOT NULL
      );
    `;

    console.log(`Created "vendors" table`);

    // Insert data into the "vendors" table
    const insertedVendors = await Promise.all(
      vendors.map(
        (vendor) => client.sql`
        INSERT INTO vendors (id, name, about, user_id, category_id)
        VALUES (${vendor.id}, ${vendor.name}, ${vendor.about}, ${vendor.user_id}, ${vendor.category_id})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedVendors.length} vendors`);

    return {
      createTable,
      vendors: insertedVendors,
    };
  } catch (error) {
    console.error('Error seeding vendors:', error);
    throw error;
  }
};

async function seedVendorProfilePic(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "vendorprofilepic" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS vendorprofilepic (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        image_url VARCHAR(255) NOT NULL,
        vendor_id UUID NOT NULL
      );
    `;

    console.log(`Created "vendorprofilepic" table`);

    // Insert data into the "vendorprofilepic" table
    const insertedVendorProfilePic = await Promise.all(
      vendorprofilepic.map(
        (profilepic) => client.sql`
        INSERT INTO vendorprofilepic (id, image_url, vendor_id)
        VALUES (${profilepic.id}, ${profilepic.image_url},${profilepic.vendor_id})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedVendorProfilePic.length} vendorprofilepic`);

    return {
      createTable,
      vendorprofilepic: insertedVendorProfilePic,
    };
  } catch (error) {
    console.error('Error seeding vendorprofilepic:', error);
    throw error;
  }
};


async function seedPackages(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "packages" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS packages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    detail VARCHAR(255) NOT NULL,
    vendor_id UUID NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    features TEXT [] NOT NULL
  );
`;


    console.log(`Created "packages" table`);

    // Insert data into the "packages" table
    const insertedPackages = await Promise.all(
      packages.map(
        (pack) => client.sql`
        INSERT INTO packages (id, name, detail, vendor_id, image_url, price, features)
        VALUES (${pack.id}, ${pack.name}, ${pack.detail}, ${pack.vendor_id}, ${pack.image_url}, ${pack.price}, ${pack.features})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedPackages.length} packages`);

    return {
      createTable,
      packages: insertedPackages,
    };
  } catch (error) {
    console.error('Error seeding packages:', error);
    throw error;
  }
}



async function seedInvoices(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "invoices" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID NOT NULL,
    amount INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    date DATE NOT NULL
  );
`;

    console.log(`Created "invoices" table`);

    // Insert data into the "invoices" table
    const insertedInvoices = await Promise.all(
      invoices.map(
        (invoice) => client.sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedInvoices.length} invoices`);

    return {
      createTable,
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedCustomers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "customers" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "customers" table`);

    // Insert data into the "customers" table
    const insertedCustomers = await Promise.all(
      customers.map(
        (customer) => client.sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedCustomers.length} customers`);

    return {
      createTable,
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function seedRevenue(client) {
  try {
    // Create the "revenue" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
    `;

    console.log(`Created "revenue" table`);

    // Insert data into the "revenue" table
    const insertedRevenue = await Promise.all(
      revenue.map(
        (rev) => client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      createTable,
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
};


async function seedTags(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "tags" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS tags (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "tags" table`);

    // Insert data into the "tags" table
    const insertedTags = await Promise.all(
      tags.map(
        (tag) => client.sql`
        INSERT INTO tags (id, name)
        VALUES (${tag.id}, ${tag.name})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedTags.length} tags`);

    return {
      createTable,
      tags: insertedTags,
    };
  } catch (error) {
    console.error('Error seeding tags:', error);
    throw error;
  }
};


async function seedPosts(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "posts" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    detail VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    vendor_id UUID NOT NULL
  );
`;


    console.log(`Created "posts" table`);

    // Insert data into the "posts" table
    const insertedPosts = await Promise.all(
      posts.map(
        (post) => client.sql`
        INSERT INTO posts (id, name, detail, image_url, vendor_id)
        VALUES (${post.id}, ${post.name}, ${post.detail}, ${post.image_url}, ${post.vendor_id})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedPosts.length} posts`);

    return {
      createTable,
      posts: insertedPosts,
    };
  } catch (error) {
    console.error('Error seeding posts:', error);
    throw error;
  }
}


async function seedPostsTags(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "postsTags" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS postsTags (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        post_id UUID NOT NULL,
        tag_id UUID NOT NULL
      );
    `;

    console.log(`Created "postsTags" table`);

    // Insert data into the "postsTags" table
    const insertedPostsTags = await Promise.all(
      postsTags.map(
        (postTag) => client.sql`
        INSERT INTO postsTags (id, post_id, tag_id)
        VALUES (${postTag.id}, ${postTag.post_id}, ${postTag.tag_id})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedPostsTags.length} postsTags`);

    return {
      createTable,
      postsTags: insertedPostsTags,
    };
  } catch (error) {
    console.error('Error seeding postsTags:', error);
    throw error;
  }
};




async function seedJumpers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "jumpers" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS jumpers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        city_id UUID NOT NULL
      );
    `;

    console.log(`Created "jumpers" table`);

    // Insert data into the "jumpers" table
    const insertedJumpers = await Promise.all(
      jumpers.map(
        (jumper) => client.sql`
        INSERT INTO jumpers (id, name, email, phone, city_id)
        VALUES (${jumper.id}, ${jumper.name}, ${jumper.email}, ${jumper.phone}, ${jumper.city_id})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedJumpers.length} jumpers`);

    return {
      createTable,
      jumpers: insertedJumpers,
    };
  } catch (error) {
    console.error('Error seeding jumpers!:', error);
    throw error;
  }
};



async function seedOrders(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "orders" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        jumper_id UUID NOT NULL,
        package_id UUID NOT NULL,
        datetime VARCHAR(255) NOT NULL,
        submittime VARCHAR(255) NOT NULL,
        status VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "orders" table`);

    // Insert data into the "orders" table
    const insertedOrders = await Promise.all(
      orders.map(
        (order) => client.sql`
        INSERT INTO orders (id, jumper_id, package_id, datetime, submittime, status)
        VALUES (${order.id}, ${order.jumper_id},${order.package_id}, ${order.datetime}, ${order.submittime}, ${order.status})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedOrders.length} orders`);

    return {
      createTable,
      orders: insertedOrders,
    };
  } catch (error) {
    console.error('Error seeding orders!:', error);
    throw error;
  }
};


async function seedvendorURL(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "vendorURL" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS vendorURL (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        url VARCHAR(255) NOT NULL,
        vendor_id UUID NOT NULL
      );
    `;

    console.log(`Created "vendorURL" table`);

    // Insert data into the "vendorURL" table
    const insertedvendorURL = await Promise.all(
      vendorURL.map(
        (link) => client.sql`
        INSERT INTO vendorURL (id, url, vendor_id)
        VALUES (${link.id},${link.url}, ${link.vendor_id})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedvendorURL.length} vendorURL`);

    return {
      createTable,
      vendorURL: insertedvendorURL,
    };
  } catch (error) {
    console.error('Error seeding vendorURL:', error);
    throw error;
  }
};




async function main() {
  const client = await db.connect();

  await seedCities(client);
  await seedCategories(client);
  await seedUsers(client);
  await seedVendors(client);
  await seedVendorProfilePic(client);
  await seedPackages(client);
  await seedCustomers(client);
  await seedInvoices(client);
  await seedRevenue(client);
  await seedTags(client);
  await seedPosts(client);
  await seedPostsTags(client);
  await seedJumpers(client);
  await seedOrders(client);
  await seedvendorURL(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
