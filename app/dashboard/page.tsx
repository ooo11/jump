
import { lusitana } from '@/app/ui/fonts';
import { fetchPackageByVendorId, fetchVendorById, getCategorybyId, getCitybyId, getUserbyId } from '@/app/lib/data'

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Packages from '../ui/packages/packageCard';
import { CreatePackages } from '../ui/packages/buttons';
import { vendorId } from '../lib/config';


export const metadata: Metadata = {
  title: 'Dashboard',
};





export default async function Page() {
  const id = vendorId;

  const [vendor, pack] = await Promise.all([
    fetchVendorById(id),
    fetchPackageByVendorId(id)
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
        <div className="relative inline-flex items-center justify-center w-24 h-24 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          <span className="text-2xl text-gray-600 dark:text-gray-300">VS</span>
        </div>
      </div>

      <h1 className={`${lusitana.className} text-xl md:text-2xl mt-5 flex w-full justify-center`}>
        {vendor.name}
      </h1>
      <p className="flex w-full justify-center text-gray-400">
        {category.name} • {city.name}
      </p>
      <div className="mt-5 flex w-full justify-center space-x-20">
        <button className='font-bold'>Twitter</button>
        <button className='font-bold'>Instagram</button>
        <button className='font-bold'>Tik Tok</button>
      </div>

      <div className="mt-5 flex w-full justify-center">
        <p className='w-1/2'>
          Vulputate odio ut enim blandit volutpat maecenas volutpat blandit. Molestie a iaculis at erat pellentesque adipiscing commodo elit at. Volutpat ac tincidunt vitae semper quis lectus nulla at volutpat. Odio facilisis mauris sit amet massa. Cursus sit amet dictum sit amet justo. Faucibus ornare suspendisse sed nisi lacus sed viverra tellus. Amet nisl purus in mollis nunc sed id. Neque sodales ut etiam sit.
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <CreatePackages />
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