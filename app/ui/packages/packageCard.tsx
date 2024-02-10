
import { fetchPackageById, fetchVendorById, getCategorybyId, getCitybyId, getUserbyId } from '@/app/lib/data';
import Image from 'next/image';
import { CheckIcon } from '@heroicons/react/20/solid'
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode, Key } from 'react';
import BuyNowButton from './gotoPackageButton';
import { formatCurrency } from '@/app/lib/utils';


export default async function Packages({
    query,
}: {
    query: string;
}) {
    const packages = await fetchPackageById(query);
    const vendor = await fetchVendorById(packages.vendor_id);
    const user = await getUserbyId(vendor.user_id);
    const city = await getCitybyId(user.city_id);
    const category = await getCategorybyId(vendor.category_id);

    return (
        <div className="mx-auto max-w-lg px-2 lg:px-4">
            <div className="mx-auto mt-8 max-w-lg rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                <div className="p-6 sm:p-8 lg:flex-auto">
                    <div className="relative flex h-32 w-38 cursor-pointer flex-col overflow-hidden rounded-xl bg-white bg-clip-border text-gray-700 shadow-md transition-opacity hover:opacity-90"
                        data-dialog-target="image-dialog" >
                        <Image
                            src={packages.image_url}
                            width={300}
                            height={300}
                            priority
                            alt="Picture of the author"
                        />
                    </div>
                    <p className="mt-2 text-base leading-10 text-gray-900">
                        {packages.name}
                    </p>

                    <p className="mt-2 flex items-baseline  gap-x-2">
                        <span className="text-2xl font-bold tracking-tight text-gray-900">{formatCurrency(packages.price)}</span>

                    </p>
                    <br />
                    {/* Click then go to  selected package page*/}


                    <BuyNowButton packageId={packages.id} />

                    <div className="mt-4 flex items-center gap-x-4">
                        <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">What’s included</h4>
                        <div className="h-px flex-auto bg-gray-100" />
                    </div>
                    <ul
                        role="list"
                        className="mt-4 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-1 sm:gap-2"
                    >


                        {packages.features.map((feature: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined, index: Key | null | undefined) => (
                            <li key={index} className="flex gap-x-3"> {/* It's better to use a unique identifier for the key if available */}
                                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                {feature}
                            </li>
                        ))}




                    </ul>
                </div>


            </div>
        </div>




    )
}
