import Form from '@/app/ui/packages/create-form';
import { fetchVendorById } from '@/app/lib/data';
import { Metadata } from 'next';


export const metadata: Metadata = {
    title: 'Create Invoice',
};


export default async function Page({ params }: { params: { vendorId: string } }) {
    const id = params.vendorId;
    const vendor = await fetchVendorById(id);

    return (
        <main>
            <Form vendors={vendor} />
        </main>
    );
}