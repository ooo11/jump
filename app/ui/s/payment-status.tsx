'use client'

import Link from "next/link";


type OrderSummaryValues = {
    message: string,
    orderId: string | undefined,
}

const domain = process.env.NEXT_PUBLIC_APP_URL_SHOP;

export default function PaymentStatus({ message, orderId }: OrderSummaryValues) {



    return (
        <main className="flex items-center justify-center md:h-screen">
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className={`mb-3 text-2xl text-center font-semibold`}>
                    Payment Status
                </h1>
                <div className='flex item-center w-full justify-center'>
                   {message}
                </div>

                <div
                    className='mt-5 mb-8 flex item-center w-full justify-center'
                ><Link href={`${domain}/status?orderid=${orderId}`} className='w-full p-2 bg-black text-white rounded-md text-center hover:bg-slate-900 cursor-pointer'>
                        See Order Status</Link>
                </div>
            </div>
        </div>
    </main>

    );
}

