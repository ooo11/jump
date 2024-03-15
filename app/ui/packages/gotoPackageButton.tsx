// components/BuyNowButton.jsx
'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

interface BuyNowButtonProps {
    vendorId: string;
    packageId: string;
}

const BuyNowButton: React.FC<BuyNowButtonProps> = ({ vendorId, packageId }) => {
    const router = useRouter();

    const handleBuyNowClick = () => {
        // Navigate to the package detail page
        router.push(`/dashboard/${vendorId}/packages/${packageId}`);
        console.log("click");

    };

    return (
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleBuyNowClick}
        >
            View package
        </button>
    );
};

export default BuyNowButton;
