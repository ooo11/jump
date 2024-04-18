import AcmeLogo from '@/app/ui/acme-logo';
import NewPasswordForm from '@/app/ui/new-password-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reset',
};

export default function NewPasswordPage() {

    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[480px] flex-col space-y-2.5 p-4 md:-mt-32">
                <NewPasswordForm />
            </div>
        </main>
    )
}