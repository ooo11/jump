
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


export default function Page() {


  // const [vendors] = await Promise.all([

  //  fetchAllVendors(),
  // ]);




  return (


    <main>
      <div className="mt-5 flex w-full justify-center">
        This is admin page
      </div>
    </main>

  );
}