import { db } from "@/app/lib/db";

// The getAllCategories function remains the same
export const getAllCategories = async () => {
    try {
        const categories = await db.category.findMany();

        return categories;
    } catch (err) {
        throw new Error('Failed to fetch categories');
    }
};


export const getCategoryById = async (id: string | undefined) => {
    try {
        const category = await db.category.findUnique({
            where: {
                id,
            }
        })
        return category;
    } catch (err) {
        throw new Error('Failed to fetch the selected category!');
    }
}


export const getAllCities = async () => {
    try {
        const categories = await db.city.findMany();

        return categories;
    } catch (err) {
        throw new Error('Failed to fetch cities');
    }
};

export const getCityById = async (id: string | undefined) => {
    try {
        const city = await db.city.findUnique({
            where: {
                id,
            }
        })
        return city;
    } catch (err) {
        throw new Error('Failed to fetch the selected city!');
    }
}

