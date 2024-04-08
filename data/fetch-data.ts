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
        const products = await db.product.findMany({
            where: {
                userId,
            }
        })
        return products;
    } catch {
        throw new Error('Failed to fetch the product!');
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
        return null
    }
}

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