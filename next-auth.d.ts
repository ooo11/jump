import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole;
    about: string | null;
    cityId: string | null | undefined;
    link: string | null | undefined;
    categoryId: string | null | undefined;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
};

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
        error?: "RefreshAccessTokenError";
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        access_token: string
        expires_at: number
        refresh_token: string
        error?: "RefreshAccessTokenError"
    }
}