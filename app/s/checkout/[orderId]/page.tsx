"use client"
import Payment from "@/app/(protected)/_components/payment";
import { formatCurrency } from "@/app/lib/utils";
import OrderSummary from "@/app/ui/s/order-summary";
import { fetchOrderById, fetchProductById } from "@/data/fetch-data";
import { useEffect, useState } from "react";

interface Order {
    id: string;
    name: string;
    email: string;
    emailVerified: Date | null;
    phone: string;
    submission: Date;
    date: string;
    time: string;
    location: string;
    cityId: string;
    productId: string;
}

interface Product {
    id: string;
    name: string;
    image: string | null;
    price: string;
    detail: string;
    userId: string;
}

export default function Page({ params }: { params: { orderId: string } }) {

    const [data, setData] = useState<Order | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrderById(params.orderId).then(order => {
            if (!order) {
                setError("Order Not Found");
                return;
            } else if (order.emailVerified === null) {
                setError("Check your email to verify.");
                return;
            } else {
                setData(order);

                fetchProductById(order.productId).then(product => {
                    if (!product) {

                        return { error: "Product Not Found" }
                    } else {

                        setProduct(product);
                        return
                    }
                });

                setError(null); // Reset error state if order is fetched successfully
                return;
            }
        });



    }, [params.orderId]);

    if (error) {
        return <div className="error-message flex justify-center items-center h-screen">{error}</div>;
    }


    if (!data) {
        // Placeholder while loading or if product is not found
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }


    return (
        <main className='flex-grow p-6 md:overflow-y-auto md:p-10'>
            <div className="flex flex-col md:flex-row content-center">
                <div className="bg-gray-200 md:basis-1/2 rounded-lg basis-full p-8">
                    <OrderSummary id={data.id} productname={product?.name} location={data.location}
                        date={data.date} time={data.time} customername={data.name} price={product?.price} />
                </div>
                <div className="md:basis-1/2  rounded-lg basis-full md:p-4">
                    <Payment />
                </div>
            </div>
        </main>
    );
}