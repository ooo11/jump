'use client';

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from 'next/link';
import {
    MapPinIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { useEffect, useState } from "react";
import { OrderFormSchema, OrderSchema } from '@/schemas';
import { useForm } from "react-hook-form";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { newOrders } from "@/actions/new-orders";

import { fetchAllCity } from "@/data/fetch-data";
import { log } from "console";

type OrdersFormValues = z.infer<typeof OrderSchema>;

interface City {
    id: string;
    name: string;
}


export default function NewOrderForm({ productId }: { productId: string }) {


    const [error, setAsError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [cities, setCities] = useState<City[]>([]);

    useEffect(() => {
        fetchAllCity().then(setCities).catch(() => console.log('Failed to fetch cities'));
    }, []);



    const { register, handleSubmit, formState: { errors } } = useForm<OrdersFormValues>({
        resolver: zodResolver(OrderFormSchema)
    });

    const onSubmit = async (data: OrdersFormValues) => {


        const formData = { ...data, productId };

        console.log({ formData });

        // Assuming newProducts is an API call to submit the form data, including the image URL.
        try {
            const result = await newOrders(formData);
            if (result.error) {
                setAsError(result.error);
                setIsFormSubmitted(false); // Ensure the form can be resubmitted if there was an error
            } else {
                if (result.success) {
                    setSuccess("Check your email for verification");
                    setIsFormSubmitted(true); // Disable the button because the form was successfully submitted
                } else {
                    setAsError("An error occurred."); // Handle this case as you see fit
                    setIsFormSubmitted(false); // Allow resubmission if needed
                }
            }
        } catch (error) {
            console.error("Submission error", error);
            setIsFormSubmitted(false); // Allow resubmission on error
        }
    };



    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md p-4 md:p-6">
                {/* Client Name */}
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        What&apos;s your name
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                {...register("name")}
                                id="name"
                                type="text"
                                name="name"
                                maxLength={100}
                                placeholder="Enter name"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="name-error"
                                disabled={isFormSubmitted && !!success}
                                autoComplete="off"
                            />
                        </div>
                    </div>


                    {errors.name && (
                        <p className="text-red-500">{errors.name.message}</p>
                    )}


                </div>
                {/* Client email */}
                <div className="mb-4">
                    <label htmlFor="email" className="mb-2 block text-sm font-medium">
                        Email
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                {...register("email")}
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter email address"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="email-error"
                                disabled={isFormSubmitted && !!success}
                            />
                        </div>
                    </div>


                    {errors.email && (
                        <p className="text-red-500">{errors.email.message}</p>
                    )}
                </div>

                {/* Client phone */}
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        Phone number
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                {...register("phone")}
                                id="phone"
                                type="text"
                                name="phone"
                                placeholder="Enter phone number"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="phone-error"
                                disabled={isFormSubmitted && !!success}
                            />
                        </div>
                    </div>


                    {errors.phone && (
                        <p className="text-red-500">{errors.phone.message}</p>
                    )}
                </div>

                {/* Client date */}
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        What&apos;s your event date
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                {...register("date")}
                                id="date"
                                type="date"
                                name="date"
                                placeholder="Enter date"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="date-error"
                                disabled={isFormSubmitted && !!success}
                            />
                        </div>
                    </div>


                    {errors.date && (
                        <p className="text-red-500">{errors.date.message}</p>
                    )}
                </div>

                {/* Client time */}
                <div className="mb-4">
                    <label htmlFor="time" className="mb-2 block text-sm font-medium">
                        Event time
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                {...register("time")}
                                id="time"
                                type="time"
                                name="time"
                                placeholder="Enter time"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="time-error"
                                disabled={isFormSubmitted && !!success}
                            />
                        </div>
                    </div>


                    {errors.time && (
                        <p className="text-red-500">{errors.time.message}</p>
                    )}
                </div>


                {/* City Select Section */}
                <div className="mt-4">
                    <label htmlFor="city" className="mb-2 block text-sm font-medium">
                        Choose city
                    </label>
                    <div className="relative">
                        <select
                            {...register("cityId")} // Use the name that matches your schema if different
                            className="select-none peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        >
                            <option value="" disabled>
                                Select a city
                            </option>
                            {/* Conditional rendering to check if categories is truthy and has length */}
                            {Array.isArray(cities) && cities.length > 0 ? (
                                cities.map((city) => (
                                    <option key={city.id} value={city.id}>
                                        {city.name}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>Loading cities...</option>
                            )}
                        </select>

                        <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                </div>


                {/* Client location */}
                <div className="mt-4">
                    <label htmlFor="location" className="mb-2 block text-sm font-medium">
                        Event location
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                {...register("location")}
                                id="location"
                                type="text"
                                name="location"
                                placeholder="Enter location address"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="location-error"
                                disabled={isFormSubmitted && !!success}
                            />
                        </div>
                    </div>


                    {errors.location && (
                        <p className="text-red-500">{errors.location.message}</p>
                    )}
                </div>


            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <div className="mt-6 flex justify-end gap-4">
                <Link href={`/dashboard`} className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">Cancel</Link>
                <Button type="submit" disabled={isFormSubmitted && !!success}  >Submit Order</Button>
            </div>
        </form>
    );
}
