"use server"
import * as z from 'zod';
import { db } from '@/app/lib/db';
import { ProductsSchema, WorkingHoursFormSchema } from '@/schemas/index';
import { currentUser } from '@/app/lib/auth';
import { getUserById } from '@/data/user';

interface ProductsFormValues {
    id: string;
    name: string;
    price: string;
    detail: string;
    image?: string | null; // Allow null here
    workingHours?: {
        initialOpeningHour: string;
        initialOpeningMinutes: string;
        initialClosingHour: string;
        initialClosingMinutes: string;
    };
}
export const updateProduct = async (productId: string, values: ProductsFormValues) => {
    const validatedProductFields = ProductsSchema.partial().safeParse(values);
    const validatedWorkingHoursFields = values.workingHours ? WorkingHoursFormSchema.partial().safeParse(values.workingHours) : null;

    if (!validatedProductFields.success || (validatedWorkingHoursFields && !validatedWorkingHoursFields.success)) {
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
        data: validatedProductFields.data,
    });

    if (validatedWorkingHoursFields && validatedWorkingHoursFields.success) {
        await db.workingHours.update({
            where: {
                productId: productId,
            },
            data: validatedWorkingHoursFields.data,
        });
    }

    return {
        success: "Product updated successfully!"
    };
};
