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

    const { name, email, password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
        return {
            error: "Email already registered! Login instead!"
        }
    }

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,

        }
    });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return {
        success: "Check your email to verify!"
    }


};