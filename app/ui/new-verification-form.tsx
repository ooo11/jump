"use client"

import { useCallback, useEffect, useState } from 'react';
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';
import { BeatLoader } from "react-spinners"
import { useSearchParams } from 'next/navigation';
import { newVerification } from '@/actions/new-verification';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';

export default function NewVerificationForm() {

    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (success || error) return;

        if (!token) {
            setError("Missing token!");
            return
        }

        newVerification(token).then((data) => {
            setSuccess(data?.success);
            setError(data?.error);
        }).catch(() => {
            setError("Something went wrong!");
        });

    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit])

    return (
        <form className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className={`${lusitana.className} mb-3 text-2xl`}>
                    Confirm your verification
                </h1>
                <div className='flex item-center w-full justify-center'>
                    {!success && !error && (
                        <BeatLoader />
                    )}

                    <FormSuccess message={success} />
                    {!success && (
                        <FormError message={error} />
                    )}

                </div>

                <div
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                ><Link href="/auth/login" className='hover:underline hover:text-gray-700 underline-offset-4 text-sm text-gray-800'>
                        Back to login</Link>
                </div>


            </div>
        </form >
    );
}