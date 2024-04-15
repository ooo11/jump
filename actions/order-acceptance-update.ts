"use server"
import * as z from 'zod';
import { OrderAcceptanceSchema } from "@/schemas";
import { db } from '@/app/lib/db';


export const orderAcceptanceUpdate = async (orderId: string, values: z.infer<typeof OrderAcceptanceSchema>) => {
    // Validate input values against the schema
    const result = OrderAcceptanceSchema.safeParse(values);
    if (!result.success) {
        return { error: "Invalid data provided", details: result.error.flatten() };
    }

    const { isAccepted } = result.data;

    try {
        // Update the order in the database
        await db.order.update({
            where: { id: orderId },
            data: { isAccepted }
        });
        return { success: "Order status updated successfully!" };
    } catch (error) {
        // Handle possible errors during the database operation
        return { error: "Failed to update order status" };
    }
}