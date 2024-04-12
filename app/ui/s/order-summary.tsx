'use client'
import { ProductsSchema } from "@/schemas";
import Image from "next/image";
import Link from "next/link";
import * as z from "zod";
import { formatCurrency } from "@/app/lib/utils";

type OrderSummaryValues = {
    id: string,
    productname: string | undefined,
    location: string,
    date: string,
    time: string,
    customername: string,
    price: string | undefined,
}

export default function OrderSummary({ id, productname, location, date, time, customername, price }: OrderSummaryValues) {



    return (
        <div>
            <h1 className="mb-5 font-semibold text-2xl font-sans text-indigo-600">Order Summary</h1>
            <ul className=" text-gray-600 font-light list-disc list-inside">
                <li>Product: {productname}</li>
                <li>Order Id: {id}</li>
                <li>Event Location: {location}</li>
                <li>Event Date: {date}</li>
                <li>Event Time: {time}</li>
                <li>Order by {customername}</li>
            </ul>
            <div className="mt-10 border-gray-300 border-t-2 pt-2 text-gray-600">
                Total: {formatCurrency(Number(price) / 100)}
            </div>
        </div>

    );
}

