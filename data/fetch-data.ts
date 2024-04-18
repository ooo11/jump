"use server";

import { db } from "@/app/lib/db";

export const fetchCityById = async (id: string | undefined) => {
    try {
        const city = await db.city.findUnique({
            where: {
                id,
            }
        })
        return city;
    } catch {
        return null
    }
}


export const fetchCategoryById = async (id: string | undefined) => {
    try {
        const category = await db.category.findUnique({
            where: {
                id,
            }
        })
        return category;
    } catch {
        return null
    }
}

export const getAllProductByUserId = async (userId: string | undefined) => {
    try {
        if (!userId) {
            console.log("No userId provided");
            return null; // or you might want to throw an error instead
        }

        const products = await db.product.findMany({
            where: {
                userId,
            },
        });
        return products;
    } catch (error) {
        console.error("Failed to fetch products for userId", userId, error);
        return null;
    }
};

export const fetchProductById = async (id: string | undefined) => {
    try {
        const product = await db.product.findUnique({
            where: {
                id,
            }
        })
        return product;
    } catch {
        return null;
    }
}

export const fetchProductAndWorkingHoursById = async (productId: string | undefined) => {
    if (!productId) return null;

    try {
        const [product, workingHours] = await Promise.all([
            db.product.findUnique({
                where: { id: productId }
            }),
            db.workingHours.findUnique({
                where: { productId }
            })
        ]);

        if (!product || !workingHours) return null;

        return {
            id: product.id,
            name: product.name,
            price: product.price,
            detail: product.detail,
            image: product.image,
            initialOpeningHour: workingHours.initialOpeningHour,
            initialOpeningMinutes: workingHours.initialOpeningMinutes,
            initialClosingHour: workingHours.initialClosingHour,
            initialClosingMinutes: workingHours.initialClosingMinutes
        };
    } catch (error) {
        console.error('Error fetching product and working hours:', error);
        return null;
    }
};

export const fetchAllCity = async () => {
    try {
        const cities = await db.city.findMany();
        return cities;
    } catch (err) {
        throw new Error('Failed to fetch cities');
    }
}

export const fetchOrderById = async (id: string | undefined) => {
    try {
        const order = await db.order.findUnique({
            where: {
                id,
            }
        })
        return order;
    } catch {
        return null
    }
}


export const getAllOrderByUserId = async (userId: string | undefined) => {
    if (!userId) {
        console.log("No userId provided");
        return null;
    }

    try {
        // Fetching products related to the user
        const products = await db.product.findMany({
            where: { userId }
        });

        if (products.length === 0) {
            console.log("No products found for this user.");
            return null;
        }

        // Extract product IDs
        const productIds = products.map(product => product.id);

        // Fetching orders that have a productId in the list of productIds
        const orders = await db.order.findMany({
            where: {
                productId: { in: productIds }
            }
        });

        return { products, orders };

    } catch (error) {
        console.error("Failed to fetch data for userId", userId, error);
        return null;
    }
};

export const fetchLinkById = async (userId: string | undefined) => {
    try {
        const order = await db.urls.findUnique({
            where: {
                userId,
            }
        })
        return order;
    } catch {
        return null
    }
}