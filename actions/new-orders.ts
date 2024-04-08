"use server"
import * as z from 'zod';
import { db } from '@/app/lib/db';
import { OrderSchema } from '@/schemas/index';
import { generateVerificationToken } from '@/app/lib/tokens';
import { sendOrderVerificationEmail } from '@/app/lib/mail';


export const newOrders = async (values: z.infer<typeof OrderSchema>) => {
    const validatedFields = OrderSchema.safeParse(values);
    if (!validatedFields.success) {
        return {
            error: "Invalid fields!"
        }
    }

    const { name, email, phone, date, time, location, cityId, productId } = validatedFields.data;



    const order = await db.order.create({
        data: {
            name,
            email,
            phone,
            date,
            time,
            location,
            cityId,
            productId,
            submission: new Date()
        }
    });



    const verificationToken = await generateVerificationToken(email);
    await sendOrderVerificationEmail(verificationToken.email, verificationToken.token, order.id)

    return {
        success: "Check your email to verify!"
    }


};