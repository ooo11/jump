
import AcmeLogo from '@/app/ui/acme-logo';
import NewOrderVerificationForm from '@/app/ui/new-verification-order-form ';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Verification',
};


export default function NewOrderVerificationPage() {
    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <NewOrderVerificationForm />
            </div>
        </main>


    );
}