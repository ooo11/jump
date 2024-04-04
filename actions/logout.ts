"use server";

import { signOut } from "@/auth";



export const logout = async () => {

    await signOut({ redirect: false, redirectTo: "/auth/login" })


}