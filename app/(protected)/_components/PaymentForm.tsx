"use client";

import { Button } from "@/app/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React, { useState } from "react";

export default function PaymentForm() {
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
                backgroundColor: "##C8CEDA",
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
        setError("");
        setSuccess("");
        e.preventDefault();
        const cardElement = elements?.getElement("card");

        try {
            if (!stripe || !cardElement) {
                setError("Please try again in a few moments.");
                return;
            }
            const { data } = await axios.post("/api/create-payment-intent", {
                data: { amount: 1000 },
            });
            const clientSecret = data;

            const paymentResult = await stripe?.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement },
            });
            console.log(paymentResult.paymentIntent?.id);
            if (paymentResult.error) {
                setError(paymentResult.error.message);
                return;
            } else if (paymentResult.paymentIntent.status === 'succeeded') {
                setSuccess("Payment succeeded!");
                return paymentResult;
            }
            // return paymentResult
        } catch (error) {
            setError("An error occurred. Please try again.");
            return;
        }
    };

    return (
        <form className="my-4 shadow p-8 rounded-lg" onSubmit={onSubmit}>
            <label className="mb-10" htmlFor="card">Card Payment</label>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button className="mt-10" type="submit">Submit</Button>
        </form>
    );
}