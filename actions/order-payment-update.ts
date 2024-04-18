"use server"

import { OrderPaymentSchema } from "@/schemas";
import { db } from '@/app/lib/db';


export const orderPaymentUpdate = async (orderId: string, values: { paymentId: string }) => {
    // Validate input values against the schema
    const result = OrderPaymentSchema.safeParse(values);
    if (!result.success) {
        return { error: "Invalid data provided", details: result.error.flatten() };
    }

    const { paymentId } = result.data;

    try {
        // Update the order in the database
        await db.order.update({
            where: { id: orderId },
            data: { 
                isPaid: new Date(),
                paymentId,
             }
        });
        return { success: "Order status updated successfully!" };
    } catch (error) {
        // Handle possible errors during the database operation
        return { error: "Failed to update order status" };
    }
}