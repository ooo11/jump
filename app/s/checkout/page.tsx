"use client"
import Payment from "@/app/(protected)/_components/payment";
import { formatCurrency } from "@/app/lib/utils";
import OrderSummary from "@/app/ui/s/order-summary";
import PaymentStatus from "@/app/ui/s/payment-status";
import { fetchOrderById, fetchProductById } from "@/data/fetch-data";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

export default function Page() {

    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderid");
    const [order, setOrder] = useState<Order | null>(null);


    const [product, setProduct] = useState<Product | null>(null);

    const [statusMessage, setStatusMessage] = useState<string | null>(null);



    useEffect(() => {
        if (!orderId) return;

        setStatusMessage("Loading..."); // Show loading message
        setOrder(null);
        setProduct(null);

        fetchOrderById(orderId).then(order => {
            if (!order) {
                setStatusMessage("Order Not Found 🤷🏻");
                return;
            } else if (order.emailVerified === null) {
                setStatusMessage("Check your email to verify 📬");
                return;
            } else if (order.isAccepted === "REJECTED") {
                setStatusMessage("Order not accepted 🙅🏻‍♀️");
                return;
            } else if (order.isAccepted === "PENDING") {
                setStatusMessage("Waiting for vendor confirmation ⏳");
                return;
            }

            else if (order.isPaid !== null) {
                setStatusMessage("Payment recived ✅");
                return;
            }

            setOrder(order);
            setStatusMessage(null);

            fetchProductById(order.productId).then(product => {
                if (!product) {
                    setStatusMessage("Product Not Found 🤷🏻");
                    return;
                }
                setProduct(product);
            }).catch(() => setStatusMessage("Error fetching product details"));
        }).catch(() => setStatusMessage("Error fetching order details"));
    }, [orderId]);


    if (statusMessage) {
        return <PaymentStatus message={statusMessage} orderId={orderId!} />;
    }

    if (!order || !product) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }



    return (
        <main className='flex-grow p-6 md:overflow-y-auto md:p-10'>
            <div className="flex flex-col md:flex-row content-center">
                <div className="bg-gray-200 md:basis-1/2 rounded-lg basis-full p-8">
                    <OrderSummary id={order.id} productname={product?.name} location={order.location}
                        date={order.date} time={order.time} customername={order.name} price={product?.price} />
                </div>
                <div className="md:basis-1/2  rounded-lg basis-full md:p-4">
                    <Payment orderId={orderId!} price={product?.price} />
                </div>
            </div>
        </main>
    );
}