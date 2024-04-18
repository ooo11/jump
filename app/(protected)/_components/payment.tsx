"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";

type OrderValues = {
   orderId: string,
   price: string | undefined,
}

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Payment({orderId, price}:OrderValues) {

    return (

        <Elements stripe={stripePromise}>
            <PaymentForm orderId={orderId} price={price} />
        </Elements>

    );
}
