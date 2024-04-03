// pages/api/products/[id].js
"use server"
import { deleteProduct } from "@/actions/delete-products";
import { redirect } from "next/navigation";
import { revalidatePath } from 'next/cache'

export default async function handler({ params }: { params: { id: string } }) {
    const productId = params.id
    console.log({ productId });



    try {
        const result = await deleteProduct(productId);
        if (result.error) {
            // Redirect back with an error message if needed
            return { error: `Failed to delete the product` };;
        }
    } catch (error) {
        return { error: `Failed to delete the product` };;
    }
    revalidatePath('/dashboard') // Update cached dashboard
    redirect(`/dashboard`) // Navigate to the new post page
} 
