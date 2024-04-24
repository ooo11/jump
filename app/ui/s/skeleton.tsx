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
        <div className="animate-pulse p-3 ">
            <div className="bg-gray-100 group rounded-xl p-2 md:p-5 w-full">
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
                    <div className="w-fit">
                        <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                        <div className="text-xs text-gray-800">
                            <div className="flex items-center space-x-1">
                                <MapPinIcon className="w-5 h-5 text-gray-300" />
                                <span className="h-4 bg-gray-300 rounded w-24"></span>
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                                <TagIcon className="w-5 h-5 text-gray-300" />
                                <span className="h-4 bg-gray-300 rounded w-24"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center mt-4">
                    <span className="h-4 bg-gray-300 rounded w-full"></span>
                </div>
            </div>
        </div>
    );
}


