"use server";

import * as Z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/app/lib/db";
import { SettingsSchema } from "@/schemas";
import { getUserAccountByUserId, getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/app/lib/auth";
import { generateEmailUpdateVerificationToken, generateVerificationToken } from "@/app/lib/tokens";
import { sendEmailUpdateVerificationEmail, sendVerificationEmail } from "@/app/lib/mail";
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

    if (user.isOAuth) {
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    // Check if link exists and belongs to another user
    if (values.link) {
        const existingLink = await db.urls.findFirst({
            where: {
                link: values.link,
                userId: { not: user.id }
            }
        });

        if (existingLink) {
            return { error: "Great choice for a link name, but the shop link provided is already in use. Please try another one." };
        }
    }

    if (values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email);

        if (existingUser && existingUser.email !== user.email) {
            return { error: "Email already in use!" }
        }

        if (user.id) {
            const verificationToken = await generateEmailUpdateVerificationToken(
                values.email,
                user.id
            );
            await sendEmailUpdateVerificationEmail(
                verificationToken.email,
                verificationToken.token,

            );

            return { success: "Verification email sent!" };
        }

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
                        userId: user.id,
                    },
                });
            } catch (error) {
                return { error: "Failed to save link" };
            }
        } else {
            return { error: "Unauthorized!" }
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
            link: values.link
        }
    });

    return { success: "Settings Updated!" }
}