'use client';

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from 'next/link';
import {
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';

import { useFormState } from 'react-dom';
import { useCallback, useState, useTransition } from "react";
import { CldImage } from 'next-cloudinary';
import { CldUploadButton } from "next-cloudinary";
import crypto from "crypto";
import axios from 'axios';
import { newProducts } from '@/actions/new-products';
import { useCurrentUser } from "@/hooks/use-current-user";
import { ProductsFormSchema } from '@/schemas';
import { useForm } from "react-hook-form";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

type ProductsFormValues = z.infer<typeof ProductsFormSchema>;


export default function CreateProductForm() {
    const user = useCurrentUser();
    const [error, setAsError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const [uploadURL, setUploadURL] = useState<string | undefined>();
    const [publicId, setPublicId] = useState<string | undefined>();
    const { register, handleSubmit, setError, formState: { errors } } = useForm<ProductsFormValues>({
        resolver: zodResolver(ProductsFormSchema)
    });


    const handleUpload = useCallback((results: any) => {
        if (results.event === "success") {
            setUploadURL(results.info.secure_url);
            setPublicId(results.info.public_id);
        }
    }, []);

    const generateSHA1 = (data: any) => {
        const hash = crypto.createHash("sha1");
        hash.update(data);
        return hash.digest("hex");
    }

    const generateSignature = (publicId: string, apiSecret: string | undefined) => {
        const timestamp = new Date().getTime();
        return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    };

    // Your React component
    const handleDelete = async (publicId: string) => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const timestamp = new Date().getTime();
        const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
        const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
        const signature = generateSHA1(generateSignature(publicId, apiSecret));
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

        try {
            const response = await axios.post(url, {
                public_id: publicId,
                signature: signature,
                api_key: apiKey,
                timestamp: timestamp,
            });


        } catch (error) {
            console.error(error);
        }
        finally {
            setUploadURL(undefined);
            setPublicId(undefined);
        }
    };

    const onSubmit = async (data: ProductsFormValues) => {
        if (!uploadURL) {
            setError('image', { type: 'manual', message: 'Image upload is required.' });
            return;
        }

        // Update data object with the image URL.
        const formData = { ...data, image: uploadURL };

        // Assuming newProducts is an API call to submit the form data, including the image URL.
        try {
            const result = await newProducts(formData);
            if (result.error) {
                setAsError(result.error);
            } else {
                if (result.success) {
                    setSuccess("Data have been sent!")
                } else {
                    setAsError(result.error);
                }
            }
        } catch (error) {
            console.error("Submission error", error);
        }
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Product Name */}
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        What&apos;s your product name
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                {...register("name")}
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Enter Product name"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="name-error"
                            />
                        </div>
                    </div>


                    {errors.name && (
                        <p className="text-red-500">{errors.name.message}</p>
                    )}


                </div>

                {/* Product Detail */}

                <div className="mb-4">
                    <label htmlFor="detail" className="mb-2 block text-sm font-medium">
                        What&apos;s your product details
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                {...register("detail")}
                                id="detail"
                                type="text"
                                name="detail"
                                placeholder="Describe the product detail"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="detail-error"
                            />
                        </div>
                    </div>



                    {errors.detail && (
                        <p className="text-red-500">{errors.detail.message}</p>
                    )}
                </div>

                {/* Product Image */}

                <div className="mb-4">
                    <label htmlFor="image" className="mb-2 block text-sm font-medium">
                        Insert photo
                    </label>

                    <div className="relative mt-2 rounded-md">
                        <div>
                            {uploadURL && publicId && (
                                <div>
                                    <input  {...register("image")} type="hidden" name="image" value={uploadURL} />
                                    <CldImage
                                        width="960"
                                        height="600"
                                        src={uploadURL}
                                        sizes="100vw"
                                        alt="Description of my uploaded image"
                                    />
                                    <button onClick={() => handleDelete(publicId)}>Delete Image</button>
                                </div>
                            )}


                            {/* once upload -> show image */}

                            <CldUploadButton
                                options={{ sources: ['local'], maxFiles: 1, clientAllowedFormats: ['jpeg', 'png', 'jpg'], maxImageFileSize: 6900000 }}

                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}

                                onSuccess={handleUpload}
                            >
                                <span className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                >
                                    Upload
                                </span>
                            </CldUploadButton>
                        </div>
                    </div>



                    {errors.image && (
                        <p className="text-red-500">{errors.image.message}</p>
                    )}
                </div>


                {/* Product Price */}
                <div className="mb-4">
                    <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                        Choose an amount
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                {...register("price")}
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"

                                placeholder="Enter MYR amount"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="amount-error"
                            />
                            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>



                    {errors.price && (
                        <p className="text-red-500">{errors.price.message}</p>
                    )}

                </div>



            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <div className="mt-6 flex justify-end gap-4">
                <Link href={`/dashboard`} className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">Cancel</Link>
                <Button type="submit">Create Product</Button>
            </div>
        </form>
    );
}
