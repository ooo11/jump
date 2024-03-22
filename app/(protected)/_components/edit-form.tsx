'use client'

import * as z from "zod";
import { Button } from "@/app/ui/button";
import { settings } from "@/actions/settings";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useCallback, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { SettingsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CldImage } from 'next-cloudinary';
import { CldUploadButton } from "next-cloudinary";
import crypto from "crypto";
import axios from 'axios';

import { UserRole } from "@prisma/client";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { AtSymbolIcon, KeyIcon, UserCircleIcon } from "@heroicons/react/24/outline";

type SettingsFormValues = z.infer<typeof SettingsSchema>;

export default function EditVendorForm({ }: {}) {

    const user = useCurrentUser();

    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const { update } = useSession();
    const [isPending, startTransition] = useTransition();

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<SettingsFormValues>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            password: undefined, // Consider setting to '' if you expect a string
            newPassword: undefined, // Consider setting to '' if you expect a string
            name: user?.name || '',
            email: user?.email || '',
            image: user?.image || '',
            role: UserRole.USER,
        }
    });

    const [uploadURL, setUploadURL] = useState(user?.image);

    const [publicId, setPublicId] = useState(); // Track the public ID of the uploaded image
    const handleUpload = useCallback((results: any) => {
        console.log({ results });

        if (results && results.event === "success") {
            const secureUrl = results.info?.secure_url;
            const publicId = results.info?.public_id;

            setUploadURL(secureUrl);
            setPublicId(publicId);


            // Update the form value for the image
            setValue('image', secureUrl, { shouldValidate: true });
        }
    }, [setValue]);


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
            setValue('image', '', { shouldValidate: true });
        }
    };

    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {



        // Create a copy of values to modify
        const submissionValues = {
            ...values,
            password: values.password || undefined,
            newPassword: values.newPassword || undefined,
        };


        console.log({ submissionValues });


        // Check if password or newPassword fields are empty and remove them if so
        if (!submissionValues.password) {
            delete submissionValues.password;
        }
        if (!submissionValues.newPassword) {
            delete submissionValues.newPassword;
        }

        // Now, submissionValues only contains password and newPassword if they were provided

        startTransition(() => {
            settings(submissionValues)
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                    } else if (data.success) {
                        update();
                        setSuccess(data.success);
                    }
                })
                .catch(() => setError("Something went wrong!"));
        });
    };




    return (
        <div >
            <form
                className="space-y-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="w-full">
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="name"
                        >
                            Name
                        </label>
                        <div className="relative">
                            <input
                                {...register("name")}
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="name"
                                placeholder="Enter your name here"
                                disabled={isPending}

                            // Assuming "name" is a field in your form schema
                            />
                            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
                                {...register("email")}
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="email"
                                type="email"
                                placeholder="Enter your email address"
                                disabled={isPending}


                            />
                            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                        {errors.email && <p>{errors.email.message}</p>}
                    </div>

                    <div className="mt-4">
                        <label htmlFor="image" className="mb-2 block text-sm font-medium">
                            Profile photo
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">

                                {uploadURL && publicId && (
                                    <div>

                                        <CldImage
                                            width="300"
                                            height="300"
                                            src={uploadURL}
                                            sizes="100vw"
                                            alt="Description of my uploaded image"
                                            priority
                                        />
                                        <button onClick={() => handleDelete(publicId)}>Delete Image</button>
                                    </div>
                                )}

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
                            {errors.image && <p>{errors.image.message}</p>}
                        </div>
                    </div>



                    <div className="mt-4">
                        <label htmlFor="password" className="block text-xs font-medium text-gray-900">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                {...register("password")}
                                type="password"
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                placeholder="******"
                                disabled={isPending}
                            />
                            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                        {errors.password && <p>{errors.password.message}</p>}
                    </div>

                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="password"
                        >
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                {...register("newPassword")}
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="newPassword"
                                type="password"
                                placeholder="******"
                                disabled={isPending}
                            />
                            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                        {errors.password && <p>{errors.password.message}</p>}
                    </div>





                </div>
                <FormError message={error} />
                <FormSuccess message={success} />
                <Button
                    disabled={isPending}
                    type="submit"
                >
                    Save
                </Button>
            </form>
        </div>
    );
}
