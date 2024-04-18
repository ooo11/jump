
import EmailUpdateVerificationForm from '@/app/ui/email-update-verification-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Verification',
};


export default function EmailUpdateVerificationPage() {
    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <EmailUpdateVerificationForm />
            </div>
        </main>


    );
}