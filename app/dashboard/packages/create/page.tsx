import Form from '@/app/ui/packages/create-form';
import { fetchVendorById, fetchVendorByUserId } from '@/app/lib/data';
import { Metadata } from 'next';
import { vendorId } from '@/app/lib/config';


export const metadata: Metadata = {
    title: 'Create Invoice',
};


export default async function Page() {
    const id = vendorId;
    const vendor = await fetchVendorById(id);

    return (
        <main>
            <Form vendors={vendor} />
        </main>
    );
}