'use client'
import { ProductsSchema } from "@/schemas";
import Image from "next/image";
import Link from "next/link";
import * as z from "zod";
import { TrashIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "@/app/lib/utils";

type ProductCardValues = z.infer<typeof ProductsSchema>;


export default function ProductCartCard({ id, name, detail, image, price }: ProductCardValues) {



    return (
        <div>

            <div >
                <div className="h-full w-full">
                    <div className="relative w-full">
                        <Image src={image || ''} className="mb-3 h-full w-full rounded-xl 3xl:h-full 3xl:w-full" alt="Product Image" width="100" height="100" priority />
                    </div>

                    <div className="mb-3 flex items-center justify-between px-1 md:items-start">
                        <div className="mb-2">
                            <p className="text-lg font-bold"> {name} </p>
                            <p className="mt-1 text-sm font-medium md:mt-2">{detail} </p>
                        </div>
                        <div className="flex flex-row-reverse md:mt-2 lg:mt-0">

                        </div>
                    </div>
                    <div className="flex items-center justify-between md:items-center lg:justify-between ">
                        <div className="flex">
                            <p className="!mb-0 text-sm font-bold text-blue-500">{formatCurrency(Number(price) / 100)}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
}

