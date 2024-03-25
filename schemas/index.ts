import { UserRole } from '@prisma/client';
import * as z from 'zod';

export const CategoriesSchema = z.object({
    id: z.string(),
    name: z.string()
})


export const SettingsSchema = z.object({
    name: z.string().optional(),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.string().email().optional(),
    image: z.string().optional(),
    about: z.string().optional(),
    cityId: z.string().optional(),
    categoryId: z.string().optional(),

    // Allow both undefined and empty strings, but enforce min length if a value is provided
    password: z.union([z.string().min(6), z.literal("")]).optional(),
    newPassword: z.union([z.string().min(6), z.literal("")]).optional(),
})
    .refine((data) => {
        // Check if password is provided but newPassword is not (and not just an empty string)
        return !(data.password && data.password !== "" && (!data.newPassword || data.newPassword === ""));
    }, {
        message: "New password is required when changing your password.",
        path: ["newPassword"], // Adjust path if needed to show the error in the right place
    })
    .refine((data) => {
        // Check if newPassword is provided but password is not (and not just an empty string)
        return !(data.newPassword && data.newPassword !== "" && (!data.password || data.password === ""));
    }, {
        message: "Current password is required to set a new password.",
        path: ["password"], // Adjust path if needed
    });



export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum 6 characters required!"
    }),
});

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required!"
    })
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, {
        message: "Password is required!"
    }),
    code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, {
        message: "Minimum 6 characters required!"
    }),
    name: z.string().min(1, {
        message: "Name is required!"
    })
})