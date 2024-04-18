"use client";

import { orderPaymentUpdate } from "@/actions/order-payment-update";
import { Button } from "@/app/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React, { useState } from "react";

type OrderValues = {
    orderId: string,
    price: string | undefined,
 }

export default function PaymentForm({orderId, price}: OrderValues) {

    console.log({price});
    
   
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const stripe = useStripe();
    const elements = useElements();

    const CARD_ELEMENT_OPTIONS = {
        hidePostalCode: true,
        style: {
            base: {
                color: "#32325d",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "18px",
                backgroundColor: "#C8CEDA",
                "::placeholder": {
                    color: "#aab7c4",
                }
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a",
            },
        },
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const cardElement = elements?.getElement(CardElement);

        if (!stripe || !cardElement) {
            setError("Please try again in a few moments.");
            return;
        }

        try {
            const { data: clientSecret } = await axios.post("/api/create-payment-intent", {
                data: { amount: Number(price)/100 },
            });

            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement },
            });

            if (paymentResult.error) {
                setError(paymentResult.error.message);
            } else if (paymentResult.paymentIntent?.status === 'succeeded') {
                console.log(orderId);
                console.log(paymentResult.paymentIntent.id);
                await orderPaymentUpdate(orderId, { paymentId: paymentResult.paymentIntent.id });
                setSuccess("Payment succeeded!");
            }
        } catch (err) {
            setError(`An error occurred.`);
        }
    };

    return (
        <form className="my-4 shadow p-8 rounded-lg" onSubmit={onSubmit}>
            <label className="mb-10" htmlFor="card">Card Payment</label>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button className="mt-10" type="submit" disabled={!stripe || !elements}>Submit</Button>
        </form>
    );
}