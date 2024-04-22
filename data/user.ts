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



export const linkExistChecker = async (link: string | undefined) => {
    // Return early if no link is provided
    if (!link) {
        return { error: "No link provided. Please provide a valid link." };
    }

    try {
        const existingLink = await db.urls.findFirst({
            where: {
                link
            }
        });

        if (existingLink) {
            return { error: "Great choice for a link name, but the shop link provided is already in use. Please try another one." };
        } else {
            return {}; // Return an empty object if no error (link is available)
        }
    } catch (error) {
        // Handle possible errors during database access
        console.error("Failed to check link availability:", error);
        return { error: "Failed to verify link availability due to server error." };
    }
};