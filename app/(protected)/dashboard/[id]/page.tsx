"use client"
import { useEffect, useState } from 'react';
import EditPackageForm from "@/app/ui/products/edit-form";
import { fetchProductAndWorkingHoursById } from "@/data/fetch-data";

interface ProductDetailsAndWorkingHours {
    id: string;
    name: string;
    price: string;
    detail: string;
    image?: string | null;
    initialOpeningHour: string;
    initialOpeningMinutes: string;
    initialClosingHour: string;
    initialClosingMinutes: string;
}

export default function Page({ params }: { params: { id: string } }) {
    const [data, setData] = useState<ProductDetailsAndWorkingHours | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchProductAndWorkingHoursById(params.id);
            console.log(result);
            
            if (!result) {
                setError("Product or Working Hours not found");
                setIsLoading(false);
            } else {
                setData(result);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">{error}</div>;
    }

    if (data) {
        return (
            <div>
                <EditPackageForm pack={data} />
            </div>
        );
    }

    return <div className="flex justify-center items-center h-screen">Unexpected error occurred</div>;
}
