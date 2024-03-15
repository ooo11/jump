import { lusitana } from '@/app/ui/fonts';
import { fetchPackageByVendorURL, fetchVendorByURL, fetchVendorProfilePicByURL } from '@/app/lib/data'
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Packages from '@/app/ui/guest/packageCard';
import Image from 'next/image';


export const metadata: Metadata = {
    title: 'Homepage',
};





export default async function Page({ params }: { params: { url: string } }) {
    const url = params.url;
    const [vendor, pack, photo] = await Promise.all([
        fetchVendorByURL(url),
        fetchPackageByVendorURL(url),
        fetchVendorProfilePicByURL(url)
    ]);
    if (!vendor) {
        notFound();
    }

    return (

        <main>
            <div className='p-4'>
                <div className="mt-5 flex w-full justify-center">
                    <Image
                        className="w-24 h-24 rounded-full"
                        src={photo.image_url}
                        width={100}
                        height={100}
                        priority
                        alt="Picture of the vendor" />
                </div>

                <h1 className={`${lusitana.className} text-xl md:text-2xl mt-5 flex w-full justify-center`}>
                    {vendor.name}
                </h1>
                <p className="flex w-full justify-center text-gray-400">
                    {vendor.category} • {vendor.city}
                </p>

                <div className="mt-5 flex w-full justify-center">
                    <p className='md:w-1/4 sm:w-full sm:mx-2'>
                        {vendor.about}
                    </p>
                </div>


                <div className='md:mx-44 grid sm:grid-cols-2 md:grid-cols-3 gap-1 sm:px-2'>
                    {pack.map((pack, index) => (
                        <div key={index} className='overflow-hidden'>
                            <Packages query={pack.id} />
                        </div>
                    ))}
                </div>
            </div>
        </main>

    );
}