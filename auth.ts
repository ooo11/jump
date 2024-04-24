import NextAuth from "next-auth"
import { PrismaAdapter } from '@auth/prisma-adapter';

import authConfig from "@/auth.config"
import { db } from '@/app/lib/db';
import { getUserById } from "@/data/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "@/data/account";
import { getLinkById } from "@/data/seed-data";



export const {
    handlers,
    auth,
    signIn,
    signOut,
    unstable_update,
} = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            })
        },
    },
    callbacks: {
        async signIn({ user, account }) {

            // Allow OAuth without email verification
            if (account?.provider !== "credentials") return true;

            const existingUser = await getUserById(user.id);

            // Prevent sign in without email verification
            if (!existingUser?.emailVerified) return false;

            if (existingUser.isTwoFactorEnabled) {
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

                if (!twoFactorConfirmation) return false;

                // Delete two factor confirmation for next sign in
                await db.twoFactorConfirmation.delete({
                    where: { id: twoFactorConfirmation.id }
                });
            }

            return true;
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole;
            }

            if (session.user) {
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
            }

            if (session.user) {
                session.user = {
                    ...session.user,
                    name: token.name,
                    isOAuth: token.isOAuth as boolean,
                    image: token.image as string | null | undefined,
                    about: token.about as string | null,
                    categoryId: token.categoryId as string | null | undefined,
                    cityId: token.cityId as string | null | undefined,
                    link: token.link as string | null | undefined,
                }
            }
            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);
            const existingUserLink = await getLinkById(token.sub)

            if (!existingUser) return token;

            const existingAccount = await getAccountByUserId(
                existingUser.id
            );

            token.isOAuth = !!existingAccount;
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
            token.image = existingUser.image;
            token.about = existingUser.about;
            token.categoryId = existingUser.categoryId;
            token.cityId = existingUser.cityId;
            token.link = existingUserLink?.link;

            return token;
        }
    },
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt",
    },
    secret: process.env.AUTH_SECRET,
    basePath: '/api/auth',
    ...authConfig,

})