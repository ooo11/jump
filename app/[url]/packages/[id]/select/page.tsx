
import { Calendar } from '@/app/ui/packages/Calendar/calendar';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Select',
};


export default async function Page({ params }: { params: { id: string, url: string } }) {
    const packageId = params.id;
    const vendorURL = params.url


    return (
        <div className="w-full">

            <div className="mt-5 flex w-full justify-center">
                <Calendar packageId={packageId} vendorURL={vendorURL} />
            </div>
        </div>
    );
}