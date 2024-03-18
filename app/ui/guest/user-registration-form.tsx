'use client';

import { City, Package } from '@/app/lib/definitions';
import Link from 'next/link';

import { Button } from '@/app/ui/button';
import { createJumper } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { useSearchParams } from 'next/navigation';



export default function Form({ url, cities }: { url: string, cities: City[] }) {
    const initialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(createJumper, initialState); //Todo: make acton to save jumpers data -> after execute -> save orders data. 
    const searchParams = useSearchParams()
    console.log("this is from the form", url) // Logs "search"

    const dateSelected = searchParams.get('datetime');
    const packageSelected = searchParams.get('package');

    const formattedDatetime = dateSelected ? String(dateSelected) : 'No Date & Time Selected';
    const formattedPackageSelected = packageSelected ? String(packageSelected) : 'No Package Selected';




    return (
        <form action={dispatch}>
            <div className="rounded-md bg-gray-50 p-6 md:p-20">
                <input type="hidden" name="datetime" value={formattedDatetime} />
                <input type="hidden" name="package_id" value={formattedPackageSelected} />
                <input type="hidden" name="url" value={url} />
                {/* Uer Name */}
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        What&apos;s your name
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                className="peer block w-full rounded-md border border-gray-200  text-sm outline-2 placeholder:text-gray-500"
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

                {/* User Email */}

                <div className="mb-4">
                    <label htmlFor="email" className="mb-2 block text-sm font-medium">
                        What&apos;s your emails
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="next@email.com"
                                className="peer block w-full rounded-md border border-gray-200  text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="email-error"
                            />
                        </div>
                    </div>


                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.email &&
                            state.errors.email.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* User Phone */}

                <div className="mb-4">
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                        What&apos;s your phone number
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="phone"
                                type="text"
                                name="phone"
                                placeholder="Should start with 011 / 013 / 016"
                                className="peer block w-full rounded-md border border-gray-200  text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="phone-error"
                            />
                        </div>
                    </div>


                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.phone &&
                            state.errors.phone.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* List of city*/}
                <div className="mb-4">
                    <label htmlFor="city" className="mb-2 block text-sm font-medium">
                        Choose city
                    </label>
                    <div className="relative">
                        <select
                            id="city"
                            name="city_id"
                            className="select-none peer block w-full cursor-pointer rounded-md border border-gray-200 text-sm outline-2 placeholder:text-gray-500"
                        >
                            <option value="" disabled >
                                Select a city
                            </option >
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>

                            ))}

                        </select>
                    </div>
                </div>


            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href={`/${url}`}
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit">I want it now!</Button>
            </div>
        </form>
    );
}
