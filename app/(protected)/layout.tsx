
import SideNav from "@/app/(protected)/_components/sidenav";
import { SessionProvider } from 'next-auth/react';

import { auth } from "@/auth";
import { log } from "console";

interface ProtectedLayoutProps {
    children: React.ReactNode
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {

    const session = await auth();



    return (
        <SessionProvider session={session}>
            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
                {/* Only render the sidebar if the vendor exists */}

                <div className="w-full flex-none md:w-64">
                    <SideNav id={session?.user.id} />
                </div>

                <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
            </div>
        </SessionProvider>
    )
}


