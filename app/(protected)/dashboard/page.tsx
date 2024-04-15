"use client"
import React, { useEffect, useState } from 'react';
// Make sure to import the necessary hooks from React
import { UserInfo } from '@/app/(protected)/_components/user-info';
import { fetchCategoryById, fetchCityById, fetchLinkById } from '@/data/fetch-data';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Category, City } from '@prisma/client';
import ProductCard from "@/app/ui/product-card";
import { getAllProductByUserId } from "@/data/fetch-data";
import Link from 'next/link';


interface Product {
    id: string;
    name: string;
    image: string | null;
    price: string;
    detail: string;
    userId: string;
}

interface Links {
    id: string;
    link: string;
    userId: string;
}



export default function DashboardPage() {
    const user = useCurrentUser();
    const [city, setCity] = useState<City | null>(null); // State to store the city data
    const [category, setCategory] = useState<Category | null>(null); // State to store the city data
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState<Product[] | null>([]);
    const [links, setLink] = useState<Links | null>(null);

    useEffect(() => {

        if (user && user.cityId) {

            fetchCityById(user.cityId).then(fetchedCity => {
                if (fetchedCity) {
                    setCity(fetchedCity);
                }
            }).catch(error => {
                console.error('Failed to fetch city data', error);
            });
        }

        if (user && user.categoryId) {

            fetchCategoryById(user.categoryId).then(category => {
                if (category) {
                    setCategory(category);
                }
            }).catch(error => {
                console.error('Failed to fetch category data', error);
            });
        }

        if (user) {

            fetchLinkById(user.id).then(link => {
                if (link) {
                    setLink(link);
                }
            }).catch(error => {
                console.error('Failed to fetch link url', error);
            });
        }


    }, [user]);

    useEffect(() => {
        async function fetchProducts() {
            setIsLoading(true); // Start loading
            if (user?.id) {
                try {
                    const fetchedProducts = await getAllProductByUserId(user.id);
                    setProducts(fetchedProducts);
                } catch (error) {
                    console.error("Failed to fetch products:", error);
                    setProducts([]); // Optional: Decide how you want to handle this case
                } finally {
                    setIsLoading(false); // End loading
                }
            } else {
                setIsLoading(false); // Ensure loading is false if there's no user
            }
        }

        fetchProducts();
    }, [user?.id]);

    const deleteProduct = async (id: string) => {
        // Display a confirmation dialog
        const isConfirmed = window.confirm("Are you sure you want to delete this forever?");

        if (isConfirmed) {
            // User clicked 'OK', proceed with deletion
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                // Remove the deleted product from the state
                setProducts(currentProducts => (currentProducts || []).filter(product => product.id !== id));
            } else {
                alert('Failed to delete the product');
            }
        } else {
            // User clicked 'Cancel', do nothing
            console.log("Product deletion cancelled.");
        }
    };

    return (
        <main>
            <div className="flex items-center justify-center lg:pt-8 lg:pb-4">
                <UserInfo user={user} city={city} category={category} />
            </div>
            <div className="flex items-center justify-center mt-4 lg:mb-4">
            <a 
            href={`/s/${links?.link}`} 
            className='w-full w-full md:w-1/3 p-2 bg-black text-white rounded-md text-center hover:bg-slate-900 cursor-pointer'
            target="_blank"
            rel="noopener noreferrer"
            >Shop Page</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {isLoading ? (
                    <p className='flex justify-center items-center h-screen'>Loading products...</p> // Placeholder loading message; consider replacing with a spinner or similar
                ) : (
                    products!.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            detail={product.detail}
                            price={product.price}
                            image={product.image || ""}
                            onDelete={() => deleteProduct(product.id)}
                        />
                    ))
                )}
            </div>
        </main>
    );
}
