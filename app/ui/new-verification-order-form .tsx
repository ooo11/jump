"use client"

import { useCallback, useEffect, useState } from 'react';
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';
import { BeatLoader } from "react-spinners"
import { useSearchParams } from 'next/navigation';
import { newVerification } from '@/actions/new-verification';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { newOrderVerification } from '@/actions/new-order-verification';

export default function NewOrderVerificationForm() {

    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const searchParams = useSearchParams();

    const token = searchParams.get("token");
    const orderId = searchParams.get("orderid");

    console.log(orderId);


    const onSubmit = useCallback(() => {
        if (success || error) return;

        if (!token) {
            setError("Missing token!");
            return
        }

        if (!orderId) {
            setError("Missing order!");
            return
        }

        newOrderVerification(token, orderId).then((data) => {
            setSuccess(data?.success);
            setError(data?.error);
        }).catch(() => {
            setError("Something went wrong!");
        });

    }, [token, orderId, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit])

    return (
        <form className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className={`${lusitana.className} mb-3 text-2xl`}>
                    Order verification
                </h1>
                <div className='flex item-center w-full justify-center'>
                    {!success && !error && (
                        <BeatLoader />
                    )}

                    <FormSuccess message={success} />
                    {!success && (
                        <div>
                            <FormError message={error} />
                            {(success || error) && (
                                <p className='mt-4 text-sm'> If already verified please proceed to payment link below. </p>
                            )}
                        </div>

                    )}

                </div>

                <div
                    className='mt-5 mb-8 flex item-center w-full justify-center'
                ><Link href={`/s/checkout/${orderId}`} className='w-full p-2 bg-black text-white rounded-md text-center hover:bg-slate-900 cursor-pointer'>
                        Payment Link</Link>
                </div>


            </div>
        </form >
    );
}