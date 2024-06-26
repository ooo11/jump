'use client';

import * as z from 'zod';
import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useFormState, useFormStatus } from 'react-dom';
import { useState, useTransition } from 'react';
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema } from '@/schemas/index';
import { login } from '@/actions/login';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Social } from './social';

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "Email already in use with different provider!"
    : "";

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  // This function will be called on form submit if inputs are valid
  const onSubmit = (values: LoginFormValues) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError("Something went wrong"));
    })


  };

  return (
    <div className="flex-1 rounded-lg bg-gray-50 md:px-20 px-8 pb-4 pt-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div >
          {showTwoFactor && (
            // <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="code"
              >
                Two Factor Code
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  {...register('code')}
                  disabled={isPending}
                  placeholder="123456"
                />
                <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                {errors.code && <p>{errors.code.message}</p>}
              </div>
            </div>
          )}
          {!showTwoFactor && (
            <>
              {/* <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8"> */}
              <div>
                <h1 className={`mb-3 text-2xl text-center font-semibold`}>
                  Welcome back!
                </h1>
                <h4 className={`text-sm text-center font-medium`}>
                  Jumpsay is thrilled to have your return!
                </h4>
                <div className="w-full">
                  <div>
                    <label
                      className="mb-2 mt-5 block text-xs font-medium text-gray-900"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <input
                        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-2 text-sm outline-2 placeholder:text-gray-500"
                        id="email"
                        type="email"
                        disabled={isPending}
                        autoComplete='email'
                        {...register('email')}
                      />
                    </div>

                    {errors.email && <p>{errors.email.message}</p>}
                  </div>
                  <div className="mt-4">
                    <label
                      className="mb-2 mt-5 block text-xs font-medium text-gray-900"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-2 text-sm outline-2 placeholder:text-gray-500"
                        id="password"
                        type="password"
                        disabled={isPending}
                        {...register('password')}
                      />
                    </div>
                    <button className='hover:underline hover:text-gray-700 underline-offset-4 mb-5 mt-2 block text-xs font-medium text-link-blue'>
                      <Link href="/auth/reset">Forgot my password</Link>
                    </button>
                    {errors.password && <p>{errors.password.message}</p>}
                  </div>
                </div>

              </div>
            </>
          )}


          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button type="submit" className="mt-3 w-full" disabled={isPending}   >
            {showTwoFactor ? "Confirm" : "Log In"}
          </Button>

          <div
            className="flex items-end space-x-1 mb-5 mt-2"
            aria-live="polite"
            aria-atomic="true"
          ><span className='text-xs font-medium'>New to Jumpsay?</span><Link href="/auth/register" className='hover:underline hover:text-gray-700 underline-offset-4 text-xs font-medium text-link-blue'>
              Register</Link>
          </div>


        </div>

      </form >
      <p className='text-sm text-center font-medium'>
        OR
      </p>
      <div className='mt-5 mb-5'>
        <Social />
      </div>


    </div >
  );
}

