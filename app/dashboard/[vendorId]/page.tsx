
import { lusitana } from '@/app/ui/fonts';
import { fetchPackageByVendorId, fetchPackageByVendorURL, fetchVendorById, fetchVendorByURL, fetchVendorProfilePicById, fetchVendorProfilePicByURL, fetchVendorUrlById, getCategorybyId, getCitybyId, getUserbyId } from '@/app/lib/data'

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Packages from '../../ui/packages/packageCard';
import { CreatePackages, GoToHomepage } from '../../ui/packages/buttons';
import Image from 'next/image';


export const metadata: Metadata = {
  title: 'Dashboard',
};


export default async function Page({ params }: { params: { vendorId: string } }) {
  const id = params.vendorId;

  const [vendor, pack, profilepic, url] = await Promise.all([
    fetchVendorById(id),
    fetchPackageByVendorId(id),
    fetchVendorProfilePicById(id),
    fetchVendorUrlById(id)
  ]);
  if (!vendor) {
    notFound();
  }

  const user = await getUserbyId(vendor.user_id);
  const city = await getCitybyId(user.city_id);
  const category = await getCategorybyId(vendor.category_id)

  return (


    <main>
      <div className="mt-5 flex w-full justify-center">
        <Image
          className="w-24 h-24 rounded-full"
          src={profilepic.image_url}
          width={100}
          height={100}
          priority
          alt="Picture of the vendor" />
      </div>

      <h1 className={`${lusitana.className} text-xl md:text-2xl mt-5 flex w-full justify-center`}>
        {vendor.name}
      </h1>
      <p className="flex w-full justify-center text-gray-400">
        {category.name} • {city.name}
      </p>

      <div className="mt-5 flex w-full justify-center">
        <p className='md:w-1/4 sm:w-full sm:mx-2'>
          {vendor.about}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <CreatePackages vendorId={vendor.id} />
        <GoToHomepage url={url.url} />
      </div>



      <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-1 sm:px-2'>
        {pack.map((pack, index) => (
          <div key={index} className='overflow-hidden'>
            <Packages query={pack.id} />
          </div>
        ))}
      </div>
    </main>

  );
}