
import { fetchPackageById, fetchVendorById, getCategorybyId, getCitybyId, getUserbyId } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { DeletePackage, SelectPackage, UpdatePackage } from '@/app/ui/packages/buttons';
import { CheckIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode, Key } from 'react';
import BuyNowButton from '@/app/ui/packages/gotoPackageButton';
import { formatCurrency } from '@/app/lib/utils';

export const metadata: Metadata = {
    title: 'Package Page',
};


export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [pack] = await Promise.all([
        fetchPackageById(id)
    ]);
    if (!pack) {
        notFound();
    }

    const vendor = await fetchVendorById(pack.vendor_id);
    const user = await getUserbyId(vendor.user_id);
    const city = await getCitybyId(user.city_id);
    const category = await getCategorybyId(vendor.category_id);

    // const dataArray = JSON.parse(pack.features.replace(/^\{"/, '["').replace(/"}$/, '"]').replace(/","/g, '","'));

    return (
        <div className="rounded-md bg-gray-50 p-4 md:p-6 md:max-w-screen-lg sm:min-w-min">
            <div className="flex justify-end gap-2">
                <UpdatePackage id={pack.id} />
                <DeletePackage id={pack.id} />
            </div>

            <div className="p-8">
                <div className='mb-4'>
                    <Image
                        className="rounded-3xl col-span-2 row-span-2"
                        src={pack.image_url}
                        width={0}
                        height={0}
                        sizes='100vw'
                        priority
                        alt="Picture of the author"
                        style={{ width: '100%', height: 'auto' }} // optional
                    />

                </div>



                <div className='grid grid-cols-3 gap-2 mb-4'>
                    <div className='col-span-2'>
                        <h1 className='text-xl'>{pack.name}</h1>
                        <p className=" text-base leading-10 text-gray-900">
                            by {vendor.name}
                        </p>

                        <p className="my-2 text-base  text-gray-600 flex">
                            <MapPinIcon className="w-5" /> <span>{city.name}</span>
                        </p>
                        <p>Features: </p>
                        <ul
                            role="list"
                            className="my-4 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-1 sm:gap-2"
                        >


                            {pack.features.map((feature: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined, index: Key | null | undefined) => (
                                <li key={index} className="flex gap-x-3"> {/* It's better to use a unique identifier for the key if available */}
                                    <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                    {feature}
                                </li>
                            ))}




                        </ul>
                    </div>
                    <div className='bg-black rounded-3xl grid grid-rows-2 gap-2 '>
                        <p className="mt-8 flex items-baseline  gap-x-2 place-self-center">
                            <span className="text-5xl font-bold tracking-tight text-white">{formatCurrency(pack.price)}</span>
                        </p>
                        <div className='mb-8 place-self-center'>
                            <SelectPackage
                                id={pack.id} />
                        </div>
                    </div>
                </div>

                <p>Details: </p>
                <p>{pack.detail}</p>
            </div>

        </div>
    );
}