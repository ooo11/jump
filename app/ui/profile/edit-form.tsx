'use client';
import { updatePackages, updateVendor } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { Category, VendorForm, VendorLinkForm, VendorProfilePicForm, vendorURL } from '@/app/lib/definitions';
import {

    CurrencyDollarIcon, HashtagIcon,

} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useCallback, useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { CldUploadButton } from "next-cloudinary";
import crypto from "crypto";
import axios from 'axios';

export default function EditVendorForm({
    vendor,
    categories,
    profilePic,
    url

}: {
    vendor: VendorForm;
    categories: Category[];
    profilePic: VendorProfilePicForm;
    url: string;

}) {
    const initialState = { message: null, errors: {} };
    const updateVendorWithId = updateVendor.bind(null, vendor.id);
    const [state, dispatch] = useFormState(updateVendorWithId, initialState);

    const [selectedLink, setSelectedLink] = useState();

    const handleLink = (e: any) => {
        setSelectedLink(e.target.value);
    };


    const [uploadURL, setUploadURL] = useState();

    const [publicId, setPublicId] = useState(); // Track the public ID of the uploaded image
    const handleUpload = useCallback(async (results: any) => {
        if (results && results.event === "success") {

            const secureUrl = results.info?.secure_url;
            const publicId = results.info?.public_id;

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



        } catch (error) {
            console.error(error);
        }
        finally {
            setUploadURL(undefined);
            setPublicId(undefined);
        }
    };



    return (
        <form action={dispatch}>
            <input type="hidden" name="id" value={vendor.id} />
            <input type="hidden" name="vendor_id" value={vendor.user_id} />
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Business Name */}
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        What&apos;s your business name?
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="name"
                                type="text"
                                name="name"
                                defaultValue={vendor.name}
                                placeholder="Enter business name"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="name-error"
                            />
                        </div>
                    </div>


                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.name &&
                            state.errors.name.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Business URL */}
                <div className="mb-4">
                    <label htmlFor="url" className="mb-2 block text-sm font-medium">
                        What&apos;s your business url?
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="url"
                                type="text"
                                name="url"
                                defaultValue={url}
                                placeholder="Enterbusinessurl"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-32 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="name-error"
                            />
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" >jumpsay.com/</span>
                        </div>
                    </div>


                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.url &&
                            state.errors.url.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Business About */}

                <div className="mb-4">
                    <label htmlFor="about" className="mb-2 block text-sm font-medium">
                        What&apos;s your business about?
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="about"
                                type="text"
                                name="about"
                                defaultValue={vendor.about}
                                placeholder="Describe the package about"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="about-error"
                            />
                        </div>
                    </div>


                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.about &&
                            state.errors.about.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* List of category*/}
                <div className="mb-4">
                    <label htmlFor="category" className="mb-2 block text-sm font-medium">
                        Choose category
                    </label>
                    <div className="relative">
                        <select
                            id="category"
                            name="category_id"
                            className="select-none peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue={vendor.category_id}
                        >
                            <option value="" disabled >
                                Select a category
                            </option >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>

                            ))}

                        </select>
                        <HashtagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                </div>

                {/* Vendors Profile Pic */}
                <div className="mb-4">
                    <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
                        Insert your business profile photo.
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            {!uploadURL && (
                                <div>
                                    <CldImage
                                        width="300"
                                        height="300"
                                        src={profilePic.image_url}
                                        sizes="100vw"
                                        alt="Description of my uploaded image"
                                    />
                                </div>
                            )

                            }
                            {uploadURL && publicId && (
                                <div>
                                    <input type="hidden" name="image_url" value={uploadURL} />
                                    <CldImage
                                        width="300"
                                        height="300"
                                        src={uploadURL}
                                        sizes="100vw"
                                        alt="Description of my uploaded image"
                                    />
                                    <button onClick={() => handleDelete(publicId)}>Delete Image</button>
                                </div>
                            )}

                            <input
                                id="image_url"
                                type="hidden"
                                name="image_url"
                                defaultValue={profilePic.image_url}

                            />
                            {/* once upload -> show image */}

                            <CldUploadButton
                                options={{ sources: ['local'], maxFiles: 1, clientAllowedFormats: ['jpeg', 'png', 'jpg'], maxImageFileSize: 6900000 }}

                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}
                                // onSuccess={(result, { widget }) => {
                                //     if (result && result.event === "success") {

                                //         const secureUrl = result.info?.secure_url;
                                //         const publicId = result.info?.public_id;
                                //         console.log("Done! Here is the image info: ", secureUrl);
                                //         setUploadURL(secureUrl);
                                //         setPublicId(publicId);
                                //     }


                                //     widget.close();
                                // }}
                                onSuccess={handleUpload}
                            >
                                <span className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                >
                                    Upload
                                </span>
                            </CldUploadButton>
                        </div>
                    </div>


                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.name &&
                            state.errors.name.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>







            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href={`/dashboard/${vendor.id}`}
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit">Edit Vendor</Button>
            </div>
        </form>
    );
}
