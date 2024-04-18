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
    isPaid: Date | null;
    isSubmitted: Date | null;
    isAccepted: "ACCEPTED" | "REJECTED" | "PENDING";
    location: string;
    phone: string;
    productId: string;
    date: string;
    time: string;
    submission: Date;
    cityId: string;
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

    const renderStep = (status: "ACCEPTED" | "REJECTED" | "PENDING", text: string) => {
        // Determine completion status
        const isCompleted = status === "ACCEPTED";
        const isRejected = status === "REJECTED";

        if (isRejected) {
            text = "Order Rejected"
        }

        return (
            <div className="flex flex-row lg:flex-col items-center lg:p-10 p-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500' : isRejected ? 'bg-red-500' : 'bg-gray-300'}`}>
                    {isCompleted && (
                        <svg className="text-white  w-8 lg:w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                    {isRejected && (
                        <svg className="text-white  w-8 lg:w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                </div>
                <p className="text-sm lg:mt-2 mt-1 ml-2">{text}</p>
            </div>
        );
    };

    const renderDateStep = (status: Date | null, text: string) => {
        // Determine completion status
        const isCompleted = status !== null;
        return (
            <div className="flex flex-row lg:flex-col items-center lg:p-10 p-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}>
                    {isCompleted && (
                        <svg className="text-white w-8 lg:w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
                <p className="text-sm lg:mt-2 mt-1 ml-2">{text}</p> {/* Added sm:mt-0 and sm:ml-2 for spacing on small screens */}
            </div>
        );
    };

    if (error) {
        return <div className="error-message flex justify-center items-center h-screen">🤷🏻 {error}</div>;
    }


    if (!data) {
        // Placeholder while loading or if product is not found
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }


    return (
        <main className='flex justify-center items-center h-screen'>
            <div className="w-full max-w-2xl mx-auto p-6 md:p-10 rounded-lg bg-gray-50">
                <h1 className={`mb-3 text-2xl text-center font-semibold`}>
                    Status
                </h1>
                <div className="flex  lg:flex-row flex-col  lg:justify-between lg:items-center ">

                    <div className="relative flex lg:items-center">
                        {renderDateStep(data.isSubmitted, 'Order Submitted')}
                    </div>
                    <div className={`lg:flex-grow lg:border-t-8 rounded-lg ${data.isSubmitted ? 'border-green-500' : 'border-gray-300'}`}></div>

                    <div className="relative flex lg:items-center">

                        {renderStep(data.isAccepted, 'Order Accepted')}
                    </div>
                    <div className={`lg:flex-grow lg:border-t-8 rounded-lg 
                                    ${data.isAccepted==="ACCEPTED" ? 'border-green-500' : 'border-gray-300'}
                                    ${data.isAccepted==="REJECTED" ? 'border-red-500' : 'border-gray-300'}
                                    `}></div>


                    <div className="relative flex lg:items-center">
                        {renderDateStep(data.isPaid, 'Paid')}
                    </div>
                </div>

                {data.isSubmitted ? (
                    <div className="md:mt-1 mt-4">
                        <OrderSummary id={data.id} productname={product?.name} location={data.location}
                            date={data.date} time={data.time} customername={data.name} price={product?.price} />
                    </div>
                ) : null}

                {data.isAccepted === "ACCEPTED" && !data.isPaid ? (
                    <div className='mt-5 mb-8 flex item-center w-full justify-center'>
                        <Link href={`/s/checkout/${orderId}`} className='w-full p-2 bg-black text-white rounded-md text-center hover:bg-slate-900 cursor-pointer'>Pay now</Link>
                    </div>
                ) : null}
            </div>
        </main>

    );
}