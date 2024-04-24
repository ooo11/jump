"use client"

import NewOrderForm from "@/app/ui/orders/create-form";
import ProductCartCard from "@/app/ui/product-cart-card";
import { NewOrderFormSkeleton, ProductCartCardSkeleton } from "@/app/ui/s/skeleton";
import { ErrorPageNotFound } from "@/components/error-page-not-found";
import { fetchProductAndWorkingHoursById, fetchProductById } from "@/data/fetch-data";
import { useEffect, useState } from 'react';


interface Product {
    id: string;
    name: string;
    image: string | null;
    price: string;
    detail: string;
    initialOpeningHour: string;
    initialOpeningMinutes: string;
    initialClosingHour: string;
    initialClosingMinutes: string;
}

export default function Page({ params }: { params: { id: string, url: string } }) {


    const [data, setData] = useState<Product | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const product = await fetchProductAndWorkingHoursById(params.id);
                if (product) {
                    setData(product);
                } else {
                    console.error('Product not found');
                }
            } catch (error) {
                console.error('Failed to fetch product', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            // Here, you'd handle any cleanup actions, such as aborting fetch requests.
            console.log("Cleanup actions on component unmount");
        };
    }, [params.id]);
    if (loading) {
        return (
            <main className='flex-grow p-6 md:overflow-y-auto md:p-20 max-w-7xl'>
                <div className="flex flex-col md:flex-row content-center">
                    <div className="bg-gray-200 md:basis-1/2 rounded-lg basis-full p-10">
                        <ProductCartCardSkeleton />
                    </div>
                    <div className="md:basis-1/2 rounded-lg basis-full bg-blue-100 p-10">
                        <NewOrderFormSkeleton />
                    </div>
                </div>
            </main>
        );
    }

    if (!data) {
        return <ErrorPageNotFound />;
    }

    return (
        <main className='flex-grow p-6 md:overflow-y-auto md:p-20 max-w-7xl'>
            <div className="flex flex-col md:flex-row content-center">
                <div className="bg-gray-200 md:basis-1/2 rounded-lg basis-full p-10">
                    <ProductCartCard
                        id={data.id}
                        name={data.name}
                        detail={data.detail}
                        price={data.price}
                        image={data.image || ""}
                    />
                </div>
                <div className="md:basis-1/2  rounded-lg basis-full bg-blue-100 p-10">
                    <NewOrderForm productId={data.id} url={params.url}
                        openHour={data.initialOpeningHour}
                        openMinute={data.initialOpeningMinutes}
                        closeHour={data.initialClosingHour}
                        closeMinute={data.initialClosingMinutes}
                    />
                </div>
            </div>
        </main>
    );
}
