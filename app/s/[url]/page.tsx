"use client"

import React, { useState, useEffect } from 'react';
import { useSearchParams } from "next/navigation";
import PublicProductCard from '@/app/ui/s/public-product-card';
import { VendorInfo } from '@/app/ui/s/vendor-info';
import style from '@/public/styles/grid.module.css'
import { ErrorPageNotFound } from '@/components/error-page-not-found';
import {
    fetchCityById,
    fetchCategoryById,
    getAllProductByUserId,
    fetchVendorIdByLink,
    fetchVendorById,
} from '@/data/fetch-data';
import { Category, City } from '@prisma/client';
import VendorInfoSkeleton from '@/app/ui/s/skeleton';

interface Vendor {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    about: string | null;
    cityId: string | null;
    categoryId: string | null;
}

interface User {
    cityId?: string;
    categoryId?: string;
}

interface Product {
    id: string;
    name: string;
    image: string | null;
    price: string;
    detail: string;
    userId: string;
}


interface Params {
    url: string;
}

interface VendorId {
    userId: string;
}

export default function ShopPage({ params }: { params: { url: string } }) {
    const [user, setUser] = useState<Vendor | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [city, setCity] = useState<City | null>(null);
    const [category, setCategory] = useState<Category | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        async function fetchData() {
            setLoading(true);  // Start loading before fetching data
            try {
                const vendor = await fetchVendorIdByLink(params.url);
                if (!vendor) {
                    setError(true);
                    return;
                }

                const fetchedUser = await fetchVendorById(vendor?.userId);
                const fetchedProducts = await getAllProductByUserId(vendor?.userId);

                if (!fetchedProducts) {
                    setError(true);
                    return;
                }

                setUser(fetchedUser);
                setProducts(fetchedProducts);

                if (fetchedUser?.cityId) {
                    const fetchedCity = await fetchCityById(fetchedUser.cityId);
                    setCity(fetchedCity);
                }

                if (fetchedUser?.categoryId) {
                    const fetchedCategory = await fetchCategoryById(fetchedUser.categoryId);
                    setCategory(fetchedCategory);
                }
            } catch (error) {
                setError(true);
            } finally {
                setLoading(false);  // End loading after all data is fetched or an error occurred
            }
        }

        fetchData();
    }, [params.url]);

    if (isLoading) {
        return (
            <main className='flex-grow p-6 md:p-24'>
                <div className="flex items-center justify-center pt-10">
                    <VendorInfoSkeleton />
                </div>
                <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-20 md:p-10 items-start place-items-center">
                    {new Array(3).fill(null).map((_, index) => (
                        <div key={index} className="animate-pulse bg-gray-100 rounded-lg w-full h-80  m-4 p-4 "></div>
                    ))}
                </div>
            </main>
        );;
    }


    if (error) {
        return <ErrorPageNotFound />;
    }



    return (
        <main className='flex-grow p-6 md:overflow-y-auto md:p-24'>
            <div className="flex items-center justify-center pt-10">
                <VendorInfo user={user} city={city} category={category} />
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:p-10 items-start place-items-center ${style.grid}`}>
                {products.map((product) => (
                    <PublicProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        detail={product.detail}
                        price={product.price}
                        image={product.image || ""}
                        url={params.url}
                    />
                ))}
            </div>
        </main>
    );
}
