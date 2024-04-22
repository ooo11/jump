"use server"
import * as z from 'zod';
import { db } from '@/app/lib/db';
import { RegisterShopNameFormSchema } from '@/schemas/index';
import { redirect } from 'next/navigation'


export const linkChecker = async (values: z.infer<typeof RegisterShopNameFormSchema>) => {
    const validatedFields = RegisterShopNameFormSchema.safeParse(values);
    if (!validatedFields.success) {
        return {
            error: "Invalid fields!"
        }
    }
    const { link } = validatedFields.data;

    // Check if link exists and belongs to another user
    if (link) {
        const existingLink = await db.urls.findFirst({
            where: {
                link
            }
        });

        if (existingLink) {
            return { error: "Great choice, but the shop link is already taken" };
        }
    }

    return {
        redirect: {
            destination: '/auth/register',
            permanent: false,
        },
    }




};