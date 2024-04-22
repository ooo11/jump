"use server"
import * as z from 'zod';
import { db } from '@/app/lib/db';
import { RegisterSchema } from '@/schemas/index';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '@/data/user';

import { generateVerificationToken } from '@/app/lib/tokens';
import { sendVerificationEmail } from '@/app/lib/mail';

export const registers = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);
    if (!validatedFields.success) {
        return {
            error: "Invalid fields!"
        }
    }
    const { name, email, password, link } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
        return {
            error: "Email already registered! Login instead!"
        }
    }
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


    const user = await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,

        }
    });

    if (link) {
        await db.urls.create({
            data: {
                link: link,
                userId: user.id,
            },
        });
    }

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return {
        success: "Check your email to verify!"
    }


};