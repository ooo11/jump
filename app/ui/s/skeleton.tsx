// Skeleton for ProductCartCard
export const ProductCartCardSkeleton = () => (
    <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-gray-300 h-10 w-10"></div>
        <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-gray-300 rounded"></div>
            <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-gray-300 rounded col-span-2"></div>
                    <div className="h-2 bg-gray-300 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-gray-300 rounded"></div>
            </div>
        </div>
    </div>
);

// Skeleton for NewOrderForm
export const NewOrderFormSkeleton = () => (
    <div className="animate-pulse p-10 rounded-lg bg-blue-100">
        <div className="flex flex-col space-y-3">
            <div className="h-8 bg-gray-300 rounded"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        </div>
    </div>
);

import { MapPinIcon, TagIcon } from '@heroicons/react/24/outline';
import React from 'react';

export default function VendorInfoSkeleton() {
    return (
        <div className="overflow-hidden group rounded-xl p-3 md:p-5 w-full md:w-1/3 animate-pulse">
            <div className="w-full flex justify-center items-center">
                {/* Placeholder for the profile image */}
                <div className="bg-gray-300 rounded-full w-24 h-24"></div>
            </div>
            <div className="w-full flex justify-center items-center mt-2">
                {/* Placeholder for the name */}
                <div className="bg-gray-300 h-6 w-1/4 rounded"></div>
            </div>
            <div className="w-full flex justify-center items-center mt-2">
                {/* Placeholders for location and category */}
                <div className="flex items-center">
                    <MapPinIcon className="w-3 h-3 text-gray-300 mr-1" />
                    <div className="bg-gray-300 h-4 w-24 rounded"></div>
                </div>
                <div className="mx-2"></div>
                <div className="flex items-center">
                    <TagIcon className="w-3 h-3 text-gray-300 mr-1" />
                    <div className="bg-gray-300 h-4 w-24 rounded"></div>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center mt-2 w-full">
                {/* Placeholder for the about text, now stacked vertically */}
                <div className="bg-gray-300 h-6 w-3/4 rounded mb-2"></div>
                <div className="bg-gray-300 h-6 w-2/4 rounded"></div>
            </div>
        </div>
    );
}


