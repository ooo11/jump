import * as z from 'zod';
import { db } from '@/app/lib/db';
import { currentUser } from '@/app/lib/auth';
import { getUserById } from '@/data/user';


export const deleteProduct = async (productId: string) => {
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized!" };
    }

    const dbUser = await getUserById(user.id);
    if (!dbUser) {
        return { error: "Unauthorized!" };
    }

    const product = await db.product.findUnique({
        where: {
            id: productId,
        },
    });

    if (!product || product.userId !== dbUser.id) {
        return { error: "Unauthorized or Product not found!" };
    }

    await db.product.delete({
        where: {
            id: productId,
        },
    });

    return {
        success: "Product deleted successfully!"
    };
};
