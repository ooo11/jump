"use client"
import React, { useEffect, useState } from 'react';
// Make sure to import the necessary hooks from React
import { UserInfo } from '@/app/(protected)/_components/user-info';
import { fetchCategoryById, fetchCityById } from '@/data/fetch-data';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Category, City } from '@prisma/client';
import { useSession } from 'next-auth/react';
import LoginForm from '@/app/ui/login-form';

export default function DashboardPage() {
    const { data: session } = useSession()
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

    if (session) {
        return (
            <main>
                {/* Only pass `city` prop if it is not null */}
                <UserInfo user={user} city={city} category={category} />
            </main>
        );
    }


    return (
        <main>
            <LoginForm />
        </main>
    );
}
