// components/BuyNowButton.jsx
'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

interface BuyNowButtonProps {
    packageId: string;
}

const BuyNowButton: React.FC<BuyNowButtonProps> = ({ packageId }) => {
    const router = useRouter();

    const handleBuyNowClick = () => {
        // Navigate to the package detail page
        router.push(`/guest/packages/${packageId}`);
        console.log("click");

    };

    return (
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleBuyNowClick}
        >
            Buy Now
        </button>
    );
};

export default BuyNowButton;
