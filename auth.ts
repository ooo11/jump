import NextAuth from "next-auth"
import { PrismaAdapter } from '@auth/prisma-adapter';

import authConfig from "@/auth.config"
import { db } from '@/app/lib/db';
import { getUserById } from "@/data/user";
import { UserRole } from "@prisma/client";
import { getAccountByUserId } from "@/data/account";



export const {
    handlers: { GET, POST },
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
        }
    },
    callbacks: {
        async signIn({ user, account }) {

            const existingUser = await getUserById(user.id);

            // Prevent sign in without email verification
            if (!existingUser?.emailVerified) return false;



            return true;
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            if (token.role && session.user) {
                session.user.role = token.role as UserRole
            }
            if (session.user) {
                session.user = {
                    ...session.user,
                    name: token.name,
                    image: token.image as string | null | undefined,
                }
            }
            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;
            const existingUser = await getUserById(token.sub);

            if (!existingUser) return token

            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
            token.image = existingUser.image;

            return token;
        }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
})