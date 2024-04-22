"use client"
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { RegisterShopNameFormSchema } from '@/schemas';
import { linkChecker } from '@/actions/link-checker';
import { useRouter } from 'next/navigation';
import React from 'react';
import LandingNav from '@/app/ui/nav-landing';

type RegisterShopFormValues = z.infer<typeof RegisterShopNameFormSchema>;

export default function Page() {
  const router = useRouter()

  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();


  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<RegisterShopFormValues>({
    resolver: zodResolver(RegisterShopNameFormSchema),
  });


  // Watch the 'link' field to clear errors when user starts typing
  const linkValue = watch("link");
  React.useEffect(() => {
    if (linkValue) { // if there's a value (i.e., user is typing), clear error messages
      setError("");
    }
  }, [linkValue]); // Only re-run the effect if linkValue changes


  // This function will be called on form submit if inputs are valid
  const onSubmit = (values: RegisterShopFormValues) => {
    setError("");

    startTransition(() => {
      linkChecker(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            router.push(`/auth/register?link=${values.link}`)
          }
        })
        .catch((error) => {
          // It's also a good idea to handle any unexpected errors that might occur during the API call.
          setError("An unexpected error occurred. Please try again.");
        });
    });
  };


  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 md:overflow-visible">
        <div className="-m-6 max-h-[768px] w-[calc(100%+48px)] overflow-scroll lg:overflow-auto">
          <LandingNav />

          <div className="mt-4 flex grow flex-col gap-4 md:flex-row">

            <div className="flex flex-col justify-center gap-2 rounded-lg bg-gray-50 px-6 py-10 md:w-1/2 md:px-20">

              <p className={`text-2xl text-button-theme md:text-6xl font-black tracking-tight leading-tight`}>
                <strong>All your services <br /> in one simple link.</strong>
              </p>
              <p className={`text-sm text-gray-800 md:text-md md:leading-normal`}>
                Create your personal online store to market and distribute your freelance services through a single link.
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div className="mt-4">

                  <div className='flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4'>
                    <div className="relative w-full md:w-5/6 md:w-4/6"> {/* Flex-1 will allow the input to fill the space */}
                      <input
                        {...register("link")}
                        className="peer block w-full h-12 rounded-lg border-2 border-gray-200 py-[9px] pl-[130px] text-sm outline-2 placeholder:text-gray-500 focus:border-button-theme focus:outline-none focus:ring-0"
                        id="link"
                        type="string"
                        placeholder="yourshop"
                        maxLength={100}
                        autoComplete='off'
                        autoCapitalize='off'
                      />
                      <p className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900">jumpsay.com/s/</p>
                    </div>


                    <button type="submit" className="w-full md:w-2/6 py-3 md:w-2/5 h-12text-sm font-medium text-white bg-button-theme transition-colors hover:bg-button-theme-active md:text-base rounded-[120px]" disabled={isPending}> {/* Removed margin-top */}
                      Claim yours
                    </button>
                  </div>
                  {errors.link && <p className="text-red-500 text-sm mt-4">{errors.link.message}</p>}
                  {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                </div>


              </form >
            </div>

          </div>
        </div>
      </div>
    </main >
  );
}
