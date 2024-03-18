import Form from '@/app/ui/profile/edit-form';
import { fetchVendorById, fetchCategory, fetchVendorProfilePicById, fetchVendorUrlById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Vendor',
};


export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const [vendor, category, profilePic, url] = await Promise.all([
    fetchVendorById(id),
    fetchCategory(),
    fetchVendorProfilePicById(id),
    fetchVendorUrlById(id)

  ]);
  if (!vendor) {
    notFound();
  }
  return (
    <main>

      <Form vendor={vendor} categories={category} profilePic={profilePic} url={url.url} />
    </main>
  );
}