"use server";

import { auth, signOut } from "@/auth";
import { redirect } from 'next/navigation'


export const logout = async () => {

    const data = await signOut({ redirect: false, redirectTo: "/auth/login" })
    redirect(data.url)

}