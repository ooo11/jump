"use client";

import { orderPaymentUpdate } from "@/actions/order-payment-update";
import { Button } from "@/app/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React, { useState } from "react";

const domainShop = process.env.NEXT_PUBLIC_APP_URL_SHOP;

type OrderValues = {
    orderId: string,
    price: string | undefined,
}

export default function PaymentForm({ orderId, price }: OrderValues) {

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const stripe = useStripe();
    const elements = useElements();
    const CARD_ELEMENT_OPTIONS = {
        hidePostalCode: true,
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        setError("");
        setSuccess("");
        setIsLoading(true); // Start loading
        e.preventDefault();
        const cardElement = elements?.getElement("card");

        try {
            if (!stripe || !cardElement) {
                setError("Please try again in a few moments.");
                setIsLoading(false); // Stop loading
                return;
            }
            const { data } = await axios.post("/api/create-payment-intent", {
                data: { amount: price },
            });
            const clientSecret = data.toString();

            const paymentResult = await stripe?.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement },
            });

            if (paymentResult.error) {
                setError(paymentResult.error.message);
                setIsLoading(false); // Stop loading
                return;
            } else if (paymentResult.paymentIntent.status === 'succeeded') {
                await orderPaymentUpdate(orderId, { paymentId: paymentResult.paymentIntent.id });
                setSuccess("Payment succeeded!");
                setIsLoading(false); // Stop loading
                return paymentResult;
            }
            // return paymentResult
        } catch (error) {
            console.log(error);
            setError("An error occurred. Please try again.");
            setIsLoading(false); // Stop loading
            return;
        }



    };

    return (
        <form className="my-4 shadow p-8 rounded-lg" onSubmit={onSubmit} >
            <label className="mb-10" htmlFor="card">Card Payment</label>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
            <FormError message={error} />
            <FormSuccess message={success} />
            {success ?
                <a href={`${domainShop}/status?orderid=${orderId}`}
                    className='hover:underline hover:text-gray-700 underline-offset-4 mb-2 mt-10 
                block text-sm font-medium text-link-blue'
                >See Order Status</a> :
                <Button className="mt-10" type="submit" disabled={isLoading}>Submit</Button>}
        </form >
    );
}