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
