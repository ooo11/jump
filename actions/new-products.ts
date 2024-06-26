"use server"
import * as z from 'zod';
import { db } from '@/app/lib/db';
import { ProductsFormSchema } from '@/schemas/index';
import { currentUser } from '@/app/lib/auth';
import { getUserById } from '@/data/user';


export const newProducts = async (values: z.infer<typeof ProductsFormSchema>) => {
    const validatedFields = ProductsFormSchema.safeParse(values);
    if (!validatedFields.success) {
        return {
            error: "Invalid fields!"
        }
    }

    const { name, detail, price, image, 
        initialOpeningHour,
        initialOpeningMinutes,
        initialClosingHour,
        initialClosingMinutes, } = validatedFields.data;

    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized!" }
    }

    const dbUser = await getUserById(user.id);
    if (!dbUser) {
        return { error: "Unauthorized!" }
    }

    const newProduct = await db.product.create({
        data: {
            name,
            detail,
            price,
            image,
            userId: dbUser.id
        }
    });

    await db.workingHours.create({
        data:{
            productId: newProduct.id,
            initialOpeningHour,
            initialOpeningMinutes,
            initialClosingHour,
            initialClosingMinutes,
        }
    })


    return {
        success: "New product added!"
    }


};