'use client';

import * as z from 'zod';
import { Button } from './button';
import { useState, useTransition } from 'react';
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterSchema } from '@/schemas/index';
import { registers } from '@/actions/register';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import Link from 'next/link';
import { Social } from '@/app/ui/social';
import { useSearchParams } from 'next/navigation';

type RegisterFormValues = z.infer<typeof RegisterSchema>;

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const linkQueryParam = searchParams.get("link");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { link: linkQueryParam || undefined }
  });

  // This function will be called on form submit if inputs are valid
  const onSubmit = (values: RegisterFormValues) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      registers(values)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
        })
    })


  };

  return (
    <div className="flex-1 rounded-lg bg-gray-50 md:px-20 px-8  pb-4 pt-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <h1 className={`mb-3 text-2xl text-center font-bold`}>
            Join Jumpsay
          </h1>
          <h4 className={`text-sm text-center font-medium`}>
            Sign up for free!
          </h4>
          <div className="w-full">
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="name"
              >
                Shop Name
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-2 text-sm outline-2 placeholder:text-gray-500"
                  id="name"
                  required
                  disabled={isPending}
                  {...register('name')}
                />
              </div>
              {errors.name && <p>{errors.name.message}</p>}
            </div>
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-2 text-sm outline-2 placeholder:text-gray-500"
                  id="email"
                  type="email"
                  required
                  disabled={isPending}
                  {...register('email')}
                />
              </div>
              {errors.email && <p>{errors.email.message}</p>}
            </div>
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-sm font-medium text-gray-900"
                htmlFor="link"
              >
                Shop Link
              </label>
              <div className="relative">
                <input
                  {...register("link")}
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-[130px] text-sm outline-2 placeholder:text-gray-500"
                  id="link"
                  type="string"
                  placeholder="yourshop"
                  disabled={isPending}
                  maxLength={100}
                />
                <p className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" >jumpsay.com/s/</p>
              </div>
              {errors.link && <p className="text-red-500 text-sm">{errors.link.message}</p>}
            </div>
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-2 text-sm outline-2 placeholder:text-gray-500"
                  id="password"
                  type="password"
                  required
                  minLength={6}
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
            Register
          </Button>

          <div
            className="mt-1 h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          ><Link href="/auth/login" className='hover:underline hover:text-gray-700 underline-offset-4 text-xs font-medium text-link-blue'>
              Already have an account?</Link>
          </div>

        </div>
      </form >
      <p className='mt-2 text-sm text-center font-medium'>
        OR
      </p>
      <div className='mt-6 mb-5'>
        <Social />
      </div>
    </div>
  );
}

