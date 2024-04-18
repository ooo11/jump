import { db } from "@/app/lib/db";

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({
            where: {
                email,
            }
        })
        return user;
    } catch {
        return null;
    }
}

export const getUserById = async (id: string | undefined) => {
    try {
        const user = await db.user.findUnique({
            where: {
                id,
            }
        })
        return user;
    } catch {
        return null;
    }
}

export const getUserAccountByUserId = async (userId: string | undefined) => {
    try {
        const user = await db.account.findFirst({
            where: {
                userId,
            }
        })
        return user;
    } catch {
        return null;
    }
}

//this is public data
export const getVendorById = async (id: string | undefined) => {
    try {
        const user = await db.user.findUnique({
            where: {
                id,
            },
            // Use `select` to specify the fields you want to include in the result
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                about: true,
                cityId: true,
                categoryId: true,
                // Explicitly exclude fields you do not want
                // by not listing them here
            },
        })
        return user;
    } catch {
        return null;
    }
}

export const getVendorIdByLink = async (link: string) => {
    try {
        const data = await db.urls.findUnique({
            where: {
                link,
            }
        })
        return data;
    } catch {
        return null;
    }
}



