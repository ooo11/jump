import Form from '@/app/ui/packages/edit-form';
import { fetchPackageById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Edit Invoice',
};


export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [pack] = await Promise.all([
        fetchPackageById(id),
    ]);
    if (!pack) {
        notFound();
    }
    return (
        <main>
            <Form pack={pack} />
        </main>
    );
}