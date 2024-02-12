
import { vendorId } from '@/app/lib/config';
import { UpdateVendor } from '@/app/ui/profile/buttons';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Customer List',
};


export default async function Page() {


    const id = vendorId;

    return (
        <div className="w-full">

            <div className="mt-5 flex w-full justify-center">
                <UpdateVendor id={id} />
            </div>
        </div>
    );
}