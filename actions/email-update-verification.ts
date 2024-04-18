"use server"

import { db } from "@/app/lib/db";
import { getUserById } from "@/data/user";
import { getEmailUpdateVerificationTokenByToken } from "@/data/verification-token";

export const emailUpdateVerification = async (token: string) => {
    const existingToken = await getEmailUpdateVerificationTokenByToken(token);
    if (!existingToken) {
        return { error: "Token does not exist!" }
    };

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Token has expired! " }
    }

    const existingUser = await getUserById(existingToken.userId);
    if (!existingUser) {
        return { error: "Email does not exist!" }
    };

    await db.user.update({
        where: {
            id: existingUser.id
        },
        data: {
            emailVerified: new Date(),
            email: existingToken.email
        }
    });

    await db.emailUpdateVerificationToken.delete({
        where: { id: existingToken.id }
    });

    return { success: "Your email is now updated!" }

}