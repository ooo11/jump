import Form from '@/app/ui/packages/create-form';
import { fetchVendorByUserId } from '@/app/lib/data';
import { Metadata } from 'next';


export const metadata: Metadata = {
    title: 'Create Invoice',
};


export default async function Page() {
    const id = 'a297d2fd-63a0-4cb4-bda6-1404e2c8c09c'
    const vendor = await fetchVendorByUserId(id);

    return (
        <main>
            <Form vendors={vendor} />
        </main>
    );
}