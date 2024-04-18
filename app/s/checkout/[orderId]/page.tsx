"use client"
import Payment from "@/app/(protected)/_components/payment";
import { formatCurrency } from "@/app/lib/utils";
import OrderSummary from "@/app/ui/s/order-summary";
import PaymentStatus from "@/app/ui/s/payment-status";
import { fetchOrderById, fetchProductById } from "@/data/fetch-data";
import Link from "next/link";
import { useEffect, useState } from "react";
const domain = process.env.NEXT_PUBLIC_APP_URL_SHOP;

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
    const [recived, setRecived] = useState<string | null>(null);

    useEffect(() => {
        fetchOrderById(params.orderId).then(order => {
            if (!order) {
                setError("Order Not Found 🤷🏻");
                return;
            } else if (order.emailVerified === null) {
                setError("Check your email to verify 📬");
                return;
            } else if (order.isAccepted === "REJECTED") {
                setError("Order not accepted 🙅🏻‍♀️");
                return;
            } else if (order.isAccepted === "PENDING") {
                setError("Waiting for vendor confirmation ⏳");
                return;
            }  
            
            else if (order.isPaid !== null) {
                setRecived("Payment recived ✅");
                return;
            } 
            
            else {
                setData(order);

                fetchProductById(order.productId).then(product => {
                    if (!product) {

                        return { error: "🤷🏻 Product Not Found" }
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
        return <PaymentStatus message={error} orderId={params.orderId}/>;
    }

    if (recived) {
        return <PaymentStatus message={recived} orderId={params.orderId}/>;
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
                    <Payment orderId={params.orderId} price={product?.price}/>
                </div>
            </div>
        </main>
    );
}