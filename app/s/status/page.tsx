"use client"
import Payment from "@/app/(protected)/_components/payment";
import { formatCurrency } from "@/app/lib/utils";
import OrderSummary from "@/app/ui/s/order-summary";
import { fetchOrderById, fetchProductById } from "@/data/fetch-data";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
    isSubmitted: boolean;
    isAccepted: boolean;
    isPaid: boolean;
}

interface Product {
    id: string;
    name: string;
    image: string | null;
    price: string;
    detail: string;
    userId: string;
}

export default function Page() {
    const searchParams = useSearchParams();

    const orderId = searchParams.get("orderid");

    const [data, setData] = useState<Order | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) {
            setError("Missing order!");
            return
        }

        fetchOrderById(orderId).then(order => {
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



    }, [orderId]);

    const renderStep = (isCompleted: boolean, text: string) => (
        <div className="flex flex-col items-center p-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center gap-10 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}>
                {isCompleted && (
                    <svg className="text-white w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
            <p className="text-sm mt-1">{text}</p>
        </div>
    );

    if (error) {
        return <div className="error-message flex justify-center items-center h-screen">🤷🏻 {error}</div>;
    }


    if (!data) {
        // Placeholder while loading or if product is not found
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }


    return (
        <main className='flex justify-center items-center h-screen'>
            <div className="w-full max-w-2xl mx-auto p-6 md:p-10">
                <div className="flex justify-between items-center">
                    {renderStep(data.isSubmitted, 'Order Submitted')}
                    <div className="flex-grow border-t border-gray-300 mx-2"></div>
                    {renderStep(data.isAccepted, 'Order Accepted')}
                    <div className="flex-grow border-t border-gray-300 mx-2"></div>
                    {renderStep(data.isPaid, 'Payment')}
                </div>
                {data.isSubmitted ? (
                    <div>
                        <OrderSummary id={data.id} productname={product?.name} location={data.location}
                            date={data.date} time={data.time} customername={data.name} price={product?.price} />
                    </div>
                ) : null}
                {data.isAccepted && !data.isPaid ? (
                    <div
                        className='mt-5 mb-8 flex item-center w-full justify-center'
                    >
                        <Link href={`/s/checkout/${orderId}`} className='w-full p-2 bg-black text-white rounded-md text-center hover:bg-slate-900 cursor-pointer'>Pay now</Link>
                    </div>
                ) : null}
            </div>
        </main>
    );
}