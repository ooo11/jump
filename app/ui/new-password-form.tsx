'use client';

import * as z from 'zod';
import { lusitana } from '@/app/ui/fonts';
import {
    KeyIcon,
} from '@heroicons/react/24/outline';

import { useSearchParams } from 'next/navigation';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useState, useTransition } from 'react';
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { NewPasswordSchema } from '@/schemas';
import { newPassword } from '@/actions/new-password';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import Link from 'next/link';

type ResetFormValues = z.infer<typeof NewPasswordSchema>;

export default function NewPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetFormValues>({
        resolver: zodResolver(NewPasswordSchema),
    });

    // This function will be called on form submit if inputs are valid
    const onSubmit = (values: ResetFormValues) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            newPassword(values, token)
                .then((data) => {
                    setError(data?.error);
                    setSuccess(data?.success);
                })
        })


    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className={`mb-3 text-2xl text-center font-semibold`}>
                    Enter a new password
                </h1>
                <div className="w-full">
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="password"
                        >
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2 placeholder:text-gray-500"
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                required
                                disabled={isPending}
                                {...register('password')}
                            />
                        </div>

                        {errors.password && <p>{errors.password.message}</p>}
                    </div>
                </div>
                <FormError message={error} />
                <FormSuccess message={success} />
                <Button type="submit" className="mt-4 w-full" disabled={isPending} >
                    Reset Password
                </Button>

                {/* Add form errors here */}

                <div
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                ><Link href="/auth/login" className='hover:underline hover:text-gray-700 underline-offset-4 text-xs font-medium text-link-blue'>
                        Back to login</Link>
                </div>


            </div>
        </form >
    );
}

