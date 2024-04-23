'use client'
import { ProductsSchema } from "@/schemas";
import Image from "next/image";
import Link from "next/link";
import * as z from "zod";
import { TrashIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "@/app/lib/utils";
import { Button } from "./button";

type ProductCardValues = z.infer<typeof ProductsSchema>;
interface ProductCardProps extends ProductCardValues {
    onDelete: (id: string) => void; // Adding onDelete function type definition
}

export default function ProductCard({ id, name, detail, image, price, onDelete }: ProductCardProps) {
    function ProductDetails() {
        const text = detail;
        const newText = text.split('\n').map((str, index) => <p className="mt-1 text-sm font-medium md:mt-2" key={index}>{str}</p>);

        return newText;
    }



    return (
        <div>

            <div className="!z-5 relative flex flex-col rounded-[20px] max-w-[300px] bg-clip-border hover:shadow-3xl m-4 p-4 3xl:p-![18px] bg-gray-100">
                <div className="h-full w-full">
                    <div className="relative w-full">
                        {/* Place the Edit button absolutely within this container */}
                        <Link href={`/dashboard/${id}`} className="absolute z-10 left-2 top-2 linear rounded-[16px] bg-green-900 px-2 py-2 text-base font-medium transition duration-200 text-white hover:bg-green-800 active:bg-green-700">Edit</Link>
                        <button onClick={() => onDelete(id)}
                            className="absolute top-0 right-0 z-20 m-2 p-1 bg-red-500 hover:bg-red-300 hover:text-gray-800 text-white rounded-full"
                            aria-label="Delete product">
                            <TrashIcon className="w-6 h-6" />
                        </button>

                        <Image src={image || ''} className="mb-3 h-full w-full rounded-xl 3xl:h-full 3xl:w-full" alt="Product Image" width="100" height="100" priority />
                    </div>

                    <div className="mb-3 flex items-center justify-between px-1 md:items-start">
                        <div className="mb-2">
                            <p className="text-lg font-bold"> {name} </p>
                            <ProductDetails />
                        </div>
                        <div className="flex flex-row-reverse md:mt-2 lg:mt-0">

                        </div>
                    </div>
                    <div className="flex items-center justify-between md:items-center lg:justify-between ">
                        <div className="flex">
                            <p className="!mb-0 text-sm font-bold text-blue-500">{formatCurrency(Number(price) / 100)}</p>
                        </div>
                        <Button disabled className="linear rounded-[20px] px-4 py-2 text-base font-medium">Order Now</Button>
                    </div>
                </div>
            </div>

        </div>

    );
}

