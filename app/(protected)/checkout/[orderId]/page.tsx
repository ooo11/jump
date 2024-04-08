"use client"
import Payment from "@/app/(protected)/_components/payment";
import { formatCurrency } from "@/app/lib/utils";
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
                setError("Check your email and verify to proceed with payment.");
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
        return <div className="error-message">{error}</div>;
    }


    if (!data) {
        // Placeholder while loading or if product is not found
        return <div>Loading...</div>;
    }


    return (
        <div className="content-center flex flex-row">
            <div className="rounded-l-xl bg-gray-200 basis-1/2 p-10">
                <h1 className="mb-5 font-semibold text-2xl font-sans text-indigo-600">Order Summary</h1>
                <ul className=" text-gray-600 font-light list-disc list-inside">
                    <li>Product: {product?.name}</li>
                    <li>Order Id: {data.id}</li>
                    <li>Event Location: {data.location}</li>
                    <li>Event Date: {data.date}</li>
                    <li>Event Time: {data.time}</li>
                    <li>Order by {data.name}</li>
                </ul>
                <div className="mt-10 border-gray-300 border-t-2 pt-2 text-gray-600">
                    Total: {formatCurrency(Number(product?.price) / 100)}
                </div>
            </div>
            <div className="rounded-r-xl  basis-1/2 p-10">
                <Payment />
            </div>
        </div>
    );
}