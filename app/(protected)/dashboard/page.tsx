"use client"
import React, { useEffect, useState } from 'react';
// Make sure to import the necessary hooks from React
import { UserInfo } from '@/app/(protected)/_components/user-info';
import { fetchCategoryById, fetchCityById } from '@/data/fetch-data';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Category, City } from '@prisma/client';
import ProductCard from "@/app/ui/product-card";
import { getAllProductByUserId } from "@/data/fetch-data";
import { deleteProduct } from '@/actions/delete-products';


interface Product {
    id: string;
    name: string;
    image: string | null;
    price: string;
    detail: string;
    userId: string; // Include this if you're using it in your component
}



export default function DashboardPage() {
    const user = useCurrentUser();
    const [city, setCity] = useState<City | null>(null); // State to store the city data
    const [category, setCategory] = useState<Category | null>(null); // State to store the city data

    useEffect(() => {
        // This effect runs when the component mounts and whenever the user.id changes
        if (user && user.cityId) {
            // Assuming `user` has a `cityId` property to fetch the city for
            fetchCityById(user.cityId).then(fetchedCity => {
                if (fetchedCity) {
                    setCity(fetchedCity); // Update state if city data is fetched successfully
                }
            }).catch(error => {
                console.error('Failed to fetch city data', error);
            });
        }

        if (user && user.categoryId) {
            // Assuming `user` has a `categoryId` property to fetch the city for
            fetchCategoryById(user.categoryId).then(category => {
                if (category) {
                    setCategory(category); // Update state if city data is fetched successfully
                }
            }).catch(error => {
                console.error('Failed to fetch category data', error);
            });
        }
    }, [user]); // Depend on `user` so it re-runs when `user` changes

    const [products, setProducts] = useState<Product[]>([]);


    useEffect(() => {
        async function fetchProducts() {
            if (user?.id) {
                try {
                    const fetchedProducts = await getAllProductByUserId(user.id);
                    setProducts(fetchedProducts);
                } catch (error) {
                    console.error("Failed to fetch products:", error);
                    // Handle the error appropriately
                    setProducts([]); // Resetting or setting to a default value might be a good idea
                }
            }
        }

        fetchProducts();
    }, [user?.id]); // This effect depends on `user?.id`
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
                setProducts(currentProducts => currentProducts.filter(product => product.id !== id));
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
            <div className="flex items-center justify-center py-10">
                <UserInfo user={user} city={city} category={category} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        detail={product.detail}
                        price={product.price}
                        image={product.image || ""}
                        onDelete={deleteProduct} // Passing the delete function as a prop
                    />
                ))}
            </div>
        </main>
    );
}
