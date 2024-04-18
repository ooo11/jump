"use client"

import NewOrderForm from "@/app/ui/orders/create-form";
import ProductCartCard from "@/app/ui/product-cart-card";
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

    useEffect(() => {
        fetchProductAndWorkingHoursById(params.id).then(product => {
            if (!product) {

                return { error: "Product Not Found" }
            } else {

                setData(product);
                return
            }
        });

    }, [params.id]);

    if (!data) {
        // Placeholder while loading or if product is not found
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <main className='flex-grow p-6 md:overflow-y-auto md:p-20'>
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
                    closeMinute = {data.initialClosingMinutes}
                    />
                </div>
            </div>
        </main>
    );
}
