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

const domain = process.env.NEXT_PUBLIC_APP_URL_SHOP;

export default function NewOrderVerificationForm() {

    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const searchParams = useSearchParams();

    const token = searchParams.get("token");
    const orderId = searchParams.get("orderid");

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
                    Order Submitted
                </h1>
                <div className='flex item-center w-full justify-center'>
                    {!success && !error && (
                        <BeatLoader />
                    )}

                    <FormSuccess message={success} />
                    {!success && <FormError message={error} />}

                </div>

                <div
                    className='mt-5 mb-8 flex item-center w-full justify-center'
                ><Link href={`${domain}/status?orderid=${orderId}`} className='w-full p-2 bg-black text-white rounded-md text-center hover:bg-slate-900 cursor-pointer'>
                        See Order Status</Link>
                </div>


            </div>
        </form >
    );
}