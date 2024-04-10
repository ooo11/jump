"use server";

import * as Z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/app/lib/db";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/app/lib/auth";
import { generateVerificationToken } from "@/app/lib/tokens";
import { sendVerificationEmail } from "@/app/lib/mail";
import { unstable_update } from "@/auth";


export const settings = async (values: Z.infer<typeof SettingsSchema>) => {
    const user = await currentUser();
    if (!user) {
        return { error: "Unauthorized!" }
    }

    const dbUser = await getUserById(user.id);
    if (!dbUser) {
        return { error: "Unauthorized!" }
    }

    if (values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email);

        if (existingUser && existingUser.id !== user.id) {
            return { error: "Email already in use!" }
        }

        const verificationToken = await generateVerificationToken(
            values.email
        );
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );

        return { success: "Verification email sent!" };
    }

    if (values.password && values.newPassword && dbUser.password) {
        const passwordsMatch = await bcrypt.compare(
            values.password,
            dbUser.password,
        );

        if (!passwordsMatch) {
            return { error: "Incorrect password!" };
        }

        const hashedPassword = await bcrypt.hash(
            values.newPassword,
            10,
        );
        values.password = hashedPassword;
        values.newPassword = undefined;
    }
    const { link, ...updateValues } = values;

    const updatedUser = await db.user.update({
        where: { id: dbUser.id },
        data: {
            ...updateValues,
        }
    });

    if (values.link) {
        const existingUrl = await db.urls.findUnique({ where: { userId: user.id } });
        if (existingUrl) {
            await db.urls.update({
                where: { userId: user.id },
                data: { link: values.link },
            });
        } else if (values.link && user?.id) {
            try {
                await db.urls.create({
                    data: {
                        link: values.link,
                        userId: user.id, // Assuredly a string, not undefined
                    },
                });
                // Handle success, e.g., setting a success state or message
            } catch (error) {
                console.error("Failed to save URL:", error);
                // Handle error, e.g., setting an error state or message
            }
        } else {
            // Handle the case where userId is undefined
            console.error("User ID is undefined. Cannot save URL.");
            // Set an error state or message as needed
        }

    }

    unstable_update({
        user: {
            name: updatedUser.name,
            email: updatedUser.email,
            image: updatedUser.image,
            about: updatedUser.about,
            cityId: updatedUser.cityId,
            categoryId: updatedUser.categoryId,
            role: updatedUser.role,
        }
    });

    return { success: "Settings Updated!" }
}