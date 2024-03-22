"use server"
import * as z from 'zod';
import { ResetSchema } from "@/schemas";
import { getUserByEmail } from '@/data/user';
import { sendPasswordResetEmail } from '@/app/lib/mail';
import { generatePasswordResetToken } from '@/app/lib/tokens';


export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid Email!" }
    }

    const { email } = validatedFields.data;
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
        return { error: "Email does not exist!" }
    }
    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

    return { success: "Email sent!" }
}