"use client"
import { UserInfo } from '@/app/ui/user-info';
import { useCurrentUser } from '@/hooks/use-current-user';



export default function DashboardPage() {

    const user = useCurrentUser()


    return (
        <main>
            <UserInfo user={user} />
        </main>

    );
}