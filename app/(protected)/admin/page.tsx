"use client";


import { RoleGate } from "@/components/role-gate"
import { UserRole } from "@prisma/client"


export default function AdminPage() {


    return (
        <div>
            <RoleGate allowedRole={UserRole.ADMIN}>
                <p>You can see this secrets 🥷🏻</p>
            </RoleGate>
        </div>
    )
}