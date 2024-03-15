import { fetchCategory, fetchVendorById, fetchVendorProfilePicById } from '@/app/lib/data';
import { UpdateVendor } from '@/app/ui/profile/buttons';
import { Metadata } from 'next';
import Form from '@/app/ui/profile/edit-form';
import notFound from './not-found';

export const metadata: Metadata = {
    title: 'Customer List',
};


export default async function Page({ params }: { params: { vendorId: string } }) {

    const id = params.vendorId;
    console.log("this is the id", id);

    const [vendor, category, profilePic] = await Promise.all([
        fetchVendorById(id),
        fetchCategory(),
        fetchVendorProfilePicById(id),

    ]);
    if (!vendor) {
        notFound();
    }
    return (
        <main>

            <Form vendor={vendor} categories={category} profilePic={profilePic} />
        </main>
    );
}