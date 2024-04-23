'use client';

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from 'next/link';
import {
    MapPinIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { SetStateAction, useEffect, useState } from "react";
import { OrderFormSchema, OrderSchema } from '@/schemas';
import { useForm } from "react-hook-form";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { newOrders } from "@/actions/new-orders";
import { fetchAllCity } from "@/data/fetch-data";
import { FormEmailVerificationSent } from "@/components/form-order-email-verification";


type OrdersFormValues = z.infer<typeof OrderSchema>;

interface City {
    id: string;
    name: string;
}


export default function NewOrderForm({ productId, url, openHour, openMinute, closeHour, closeMinute }:
    { productId: string; url: string; openHour: string; openMinute: string; closeHour: string; closeMinute: string; }) {


    const [error, setAsError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [cities, setCities] = useState<City[]>([]);

    const [cityId, setCityId] = useState(''); // Initializes the state for selected city

    const handleCityChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setCityId(event.target.value); // Updates state when user selects a city
    };

    const settings = {
        initialOpeningHour: Number(openHour),
        initialOpeningMinutes: Number(openMinute),
        initialClosingHour: Number(closeHour),
        initialClosingMinutes: Number(closeMinute)
    };

    const { initialOpeningHour, initialOpeningMinutes, initialClosingHour, initialClosingMinutes } = settings;



    // State to store opening and closing times
    const [openingHour, setOpeningHour] = useState<number>(initialOpeningHour);
    const [openingMinutes, setOpeningMinutes] = useState<number>(initialOpeningMinutes);
    const [closingHour, setClosingHour] = useState<number>(initialClosingHour);
    const [closingMinutes, setClosingMinutes] = useState<number>(initialClosingMinutes);

    // Calculate options based on opening and closing times
    const timeOptions = (): string[] => {
        let options = [];
        let currentHour = openingHour;
        let currentMinutes = openingMinutes;

        while (true) {
            const time = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
            options.push(time);

            if (currentHour === closingHour && currentMinutes === closingMinutes) {
                break;
            }

            // Increment the time by 30 minutes
            currentMinutes += 30;
            if (currentMinutes >= 60) {
                currentMinutes = 0;
                currentHour++;
            }
        }

        return options;
    };


    const today = new Date();
    const currentYear = today.getFullYear();

    // Calculate tomorrow's date
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0]; // Format as "yyyy-mm-dd"

    // Calculate the last day of the current year
    const lastDayOfYear = new Date(currentYear, 11, 31); // December 31st
    const maxDate = lastDayOfYear.toISOString().split('T')[0]; // Format as "yyyy-mm-dd"



    useEffect(() => {
        fetchAllCity().then(setCities).catch(() => console.log('Failed to fetch cities'));
    }, []);



    const { register, handleSubmit, formState: { errors } } = useForm<OrdersFormValues>({
        resolver: zodResolver(OrderFormSchema)
    });

    const onSubmit = async (data: OrdersFormValues) => {

        const formData = { ...data, productId };

        // Assuming newProducts is an API call to submit the form data, including the image URL.
        try {
            const result = await newOrders(formData);
            if (result.error) {
                setAsError(result.error);
                setIsFormSubmitted(false); // Ensure the form can be resubmitted if there was an error
            } else {
                if (result.success) {
                    setSuccess(`Email verification sent to ${data.email}. The link expires in 1 hour.`);
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
            <div className="rounded-md p-4 md:p-6 max-w-md">
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
                                className="peer block w-full rounded-md border border-gray-200 py-2  text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="name-error"
                                disabled={isFormSubmitted && !!success}
                                autoComplete="off"
                                required
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
                                className="peer block w-full rounded-md border border-gray-200 py-2  text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="email-error"
                                disabled={isFormSubmitted && !!success}
                                required
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
                                className="peer block w-full rounded-md border border-gray-200 py-2  text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="phone-error"
                                disabled={isFormSubmitted && !!success}
                                required
                            />
                        </div>
                    </div>


                    {errors.phone && (
                        <p className="text-red-500">{errors.phone.message}</p>
                    )}
                </div>

                {/* Client date */}
                <div className="mb-4">
                    <label htmlFor="date" className="mb-2 block text-sm font-medium">
                        Event date
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <input
                            {...register("date")}
                            id="date"
                            type="date"
                            name="date"
                            placeholder="Enter date"
                            className="peer block w-full rounded-md border border-gray-200 py-2  text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="date-error"
                            disabled={isFormSubmitted && !!success}
                            min={minDate} // Set minimum date to tomorrow
                            max={maxDate} // Set maximum date to December 31st of the current year
                            required
                        />
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
                        <select
                            id="time"
                            className="peer block w-full rounded-md border border-gray-200 py-2  text-sm outline-2 placeholder:text-gray-500"
                            {...register("time")} // Uncomment this if using with form libraries like react-hook-form
                            required
                        >
                            <option value="" disabled selected>Select time</option> {/* Placeholder option */}
                            {timeOptions().map((time, index) => (
                                <option key={index} value={time}>{time}</option>
                            ))}
                        </select>
                        {errors.time && (
                            <p className="text-red-500">{errors.time.message}</p>
                        )}
                    </div>
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
                            defaultValue={""}
                            required
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
                                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="location-error"
                                disabled={isFormSubmitted && !!success}
                                required
                            />
                        </div>
                    </div>


                    {errors.location && (
                        <p className="text-red-500">{errors.location.message}</p>
                    )}
                </div>


            </div>
            <FormError message={error} />
            <FormEmailVerificationSent message={success} />
            <div className="mt-6 flex justify-end gap-4">
                <Link href={`/s/${url}`} className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">{success ? "Back" : "Cancel"}</Link>
                <Button type="submit" disabled={isFormSubmitted && !!success}  >Send Email Verification</Button>
            </div>
        </form>
    );
}
