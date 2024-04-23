'use client'
import { ProductsSchema } from "@/schemas";
import Image from "next/image";
import Link from "next/link";
import * as z from "zod";
import { formatCurrency } from "@/app/lib/utils";

type ProductCardValues = z.infer<typeof ProductsSchema>;
type ExtendedProductCardValues = ProductCardValues & {
    url: string;
};

export default function PublicProductCard({ id, name, detail, image, price, url }: ExtendedProductCardValues) {
    function ProductDetails() {
        const text = detail;
        const newText = text.split('\n').map((str, index) => <p className="mt-1 text-sm font-medium md:mt-2" key={index}>{str}</p>);

        return newText;
    }


    return (
        <div>

            <div className="!z-5 relative flex flex-col rounded-[20px] max-w-[300px] bg-clip-border hover:shadow-3xl m-4 p-4 3xl:p-![18px] bg-gray-100">
                <div className="h-full w-full">
                    <div className="relative w-full mb-3">
                        <Image
                            src={image || ''}
                            alt="Product Image"
                            width={300} // fixed width
                            height={300} // fixed heigh
                            className="rounded-xl"
                            priority
                        />

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
                        <Link href={`/s/${url}/order/${id}`} className="linear rounded-[20px] bg-button-theme px-4 py-2 text-base font-medium transition duration-200 text-white hover:bg-button-theme-active active:bg-black">Order Now</Link>
                    </div>
                </div>
            </div>

        </div>

    );
}

