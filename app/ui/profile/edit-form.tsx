'use client';
import { updatePackages, updateVendor } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { Category, VendorForm } from '@/app/lib/definitions';
import {

    CurrencyDollarIcon, HashtagIcon,

} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

export default function EditVendorForm({
    vendor,
    categories
}: {
    vendor: VendorForm;
    categories: Category[];
}) {
    const initialState = { message: null, errors: {} };
    const updateVendorWithId = updateVendor.bind(null, vendor.id);
    const [state, dispatch] = useFormState(updateVendorWithId, initialState);


    const baseLink = `/dashboard`


    return (
        <form action={dispatch}>
            <input type="hidden" name="id" value={vendor.id} />
            <input type="hidden" name="vendor_id" value={vendor.user_id} />
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Package Name */}
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

                {/* Package Detail */}

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

                {/* Customer Name */}
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

            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href='/dashboard'
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit">Edit Vendor</Button>
            </div>
        </form>
    );
}
