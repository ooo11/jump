"use server"

import { db } from "@/app/lib/db";
import { getOrderVerificationTokenByToken } from "@/data/verification-token";

export const newOrderVerification = async (token: string, orderId: string) => {
    const existingToken = await getOrderVerificationTokenByToken(token);
    if (!existingToken) {
        return { error: "Token does not exist!" }
    };

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Token has expired! Please place new order." }
    }

    await db.order.update({
        where: {
            id: orderId
        },
        data: {
            emailVerified: new Date(),
            email: existingToken.email,
            isSubmitted: new Date(),
        }
    });

    await db.orderVerificationToken.delete({
        where: { id: existingToken.id }
    });

    return { success: "✨ Order submitted ✨" }

}