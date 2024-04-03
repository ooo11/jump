"use server"
import * as z from 'zod';
import { db } from '@/app/lib/db';
import { ProductsSchema } from '@/schemas/index';
import { currentUser } from '@/app/lib/auth';
import { getUserById } from '@/data/user';

interface ProductsFormValues {
    id: string;
    name: string;
    price: string;
    detail: string;
    image?: string | null; // Allow null here
}

// Assuming `ProductsSchema` includes `id` for update purposes,
// or you could directly pass `productId` and a partial update schema.
export const updateProduct = async (productId: string, values: ProductsFormValues) => {
    const validatedFields = ProductsSchema.partial().safeParse(values); // Use `.partial()` if not all fields are required to update
    if (!validatedFields.success) {
        return {
            error: "Invalid fields!"
        };
    }

    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized!" };
    }

    const dbUser = await getUserById(user.id);
    if (!dbUser) {
        return { error: "Unauthorized!" };
    }

    // Check if the product belongs to the user
    const product = await db.product.findUnique({
        where: {
            id: productId,
        },
    });

    if (!product || product.userId !== dbUser.id) {
        return { error: "Unauthorized or Product not found!" };
    }

    await db.product.update({
        where: {
            id: productId,
        },
        data: validatedFields.data,
    });

    return {
        success: "Product updated successfully!"
    };
};
