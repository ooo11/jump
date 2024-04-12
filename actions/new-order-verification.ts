"use server"

import { db } from "@/app/lib/db";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const newOrderVerification = async (token: string, orderId: string) => {
    const existingToken = await getVerificationTokenByToken(token);
    if (!existingToken) {
        return { error: "Token does not exist!" }
    };

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Token has expired! " }
    }

    await db.order.update({
        where: {
            id: orderId
        },
        data: {
            emailVerified: new Date(),
            email: existingToken.email,
            isSubmitted: true,
        }
    });

    await db.verificationToken.delete({
        where: { id: existingToken.id }
    });

    return { success: "✨ Order submitted ✨" }

}