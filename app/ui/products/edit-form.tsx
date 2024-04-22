'use client';
import {

    CurrencyDollarIcon,

} from '@heroicons/react/24/outline';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useCallback, useState } from "react";
import { CldImage } from 'next-cloudinary';
import { CldUploadButton } from "next-cloudinary";
import crypto from "crypto";
import axios from 'axios';
import { ProductsEditFormSchema, ProductsSchema } from '@/schemas';
import { updateProduct } from '@/actions/edit-products';
import { useForm } from 'react-hook-form';
import { useCurrentUser } from '@/hooks/use-current-user';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';



type ProductsFormValues = z.infer<typeof ProductsEditFormSchema>;


export default function EditPackageForm({
    pack
}: {
    pack: ProductsFormValues;
}) {



    const user = useCurrentUser();
    const [error, setAsError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [uploadURL, setUploadURL] = useState(pack.image || '');
    const [publicId, setPublicId] = useState('');
    const [detailLength, setDetailLength] = useState(pack.detail.length);

    const handleDetailChange = useCallback((event: { target: { value: string | any[]; }; }) => {
        const inputLength = event.target.value.length;
        setDetailLength(inputLength); // Update the state with the current input length
    }, []);

    const priceMYR = (Number(pack.price) / 100).toFixed(2).toString();

    const { register, handleSubmit, formState: { errors } } = useForm<ProductsFormValues>({
        resolver: zodResolver(ProductsEditFormSchema),
        defaultValues: {
            id: pack.id,
            name: pack.name,
            detail: pack.detail,
            price: priceMYR,
            image: pack.image || null,
            initialOpeningHour: pack.initialOpeningHour,
            initialOpeningMinutes: pack.initialOpeningMinutes,
            initialClosingHour: pack.initialClosingHour,
            initialClosingMinutes: pack.initialClosingMinutes
        }
    });




    const handleUpload = useCallback(async (results: any) => {
        if (results && results.event === "success") {

            const secureUrl = results.info?.secure_url;
            const publicId = results.info?.public_id;
            // console.log("Done! Here is the image info: ", secureUrl);
            setUploadURL(secureUrl);
            setPublicId(publicId);
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

            // console.log("Image deleted! Here are the delete callback: ", response);

        } catch (error) {
            console.error(error);
        }
        finally {
            setUploadURL('');
            setPublicId('');
        }
    };

    const onSubmit = async (data: ProductsFormValues) => {

        const priceInCent = (parseFloat(data.price) * 100)
        // Update data object with the image URL.
        const formData = {
            ...data,
            image: uploadURL,
            price: priceInCent.toString(),
            initialOpeningHour: data.initialOpeningHour,
            initialOpeningMinutes: data.initialOpeningMinutes,
            initialClosingHour: data.initialClosingHour,
            initialClosingMinutes: data.initialClosingMinutes
        };


        // Assuming newProducts is an API call to submit the form data, including the image URL.
        try {
            const result = await updateProduct(pack.id, formData);
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
        <main>
            <div className="rounded-md bg-gray-50 p-4 md:p-6 max-w-md">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="hidden" name="id" value={pack.id} />
                    <div className="rounded-md bg-gray-50 p-4 md:p-6">
                        {/* Package Name */}
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
                                        maxLength={100}
                                        placeholder="Enter product name"
                                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        aria-describedby="name-error"
                                        autoComplete='off'
                                    />
                                </div>
                            </div>


                            {errors.name && (
                                <p className="text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="detail" className="mb-2 block text-sm font-medium">
                                What&apos;s your product details
                            </label>
                            <div className="relative mt-2 rounded-md">
                                <div className="relative">
                                    <textarea
                                        {...register("detail")}
                                        id="detail"
                                        name="detail"
                                        maxLength={140}
                                        onChange={handleDetailChange} // Add this line
                                        placeholder="Describe the product detail"
                                        className="resize-none peer block w-full lg:h-20 h-24 rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                                        aria-describedby="detail-error"
                                    />
                                    {/* Display the character count */}
                                    <div className="mt-1 text-right text-sm text-gray-500">
                                        {detailLength}/140
                                    </div>
                                </div>
                            </div>



                            {errors.detail && (
                                <p className="text-red-500">{errors.detail.message}</p>
                            )}
                        </div>

                        {/* Package Image */}

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



                        {/* Package Price */}
                        <div className="mb-4">
                            <label htmlFor="price" className="mb-2 block text-sm font-medium">
                                Change price
                            </label>
                            <div className="relative mt-2 rounded-md">
                                <div className="relative">
                                    <input
                                        {...register("price")}
                                        id="price"
                                        name="price"
                                        type="number"
                                        step="0.10"
                                        min="10.00"
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

                        {/* Opening Hours */}
                        <div className="mb-4 grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="initialOpeningHour" className="block text-sm font-medium">Opening Hour</label>
                                <select {...register("initialOpeningHour")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                    {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(hour => (
                                        <option key={hour} value={hour}>{hour}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="initialOpeningMinutes" className="block text-sm font-medium">Opening Minutes</label>
                                <select {...register("initialOpeningMinutes")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                    <option value="00">00</option>
                                    <option value="30">30</option>
                                </select>
                            </div>
                        </div>

                        {/* Closing Hours */}
                        <div className="mb-4 grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="initialClosingHour" className="block text-sm font-medium">Closing Hour</label>
                                <select {...register("initialClosingHour")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                    {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(hour => (
                                        <option key={hour} value={hour}>{hour}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="initialClosingMinutes" className="block text-sm font-medium">Closing Minutes</label>
                                <select {...register("initialClosingMinutes")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                    <option value="00">00</option>
                                    <option value="30">30</option>
                                </select>
                            </div>
                        </div>

                        {errors.initialClosingHour && (<p className="text-red-500">{errors.initialClosingHour.message}</p>)}


                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <div className="mt-6 flex justify-end gap-4">
                        <Link href={`/dashboard`} className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">Cancel</Link>
                        <Button type="submit">Edit Product</Button>



                    </div>
                </form>
            </div>
        </main>
    );
}
