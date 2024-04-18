
import Form from '@/app/(protected)/_components/edit-form';

import { getAllCategories, getAllCities } from '@/data/seed-data';


export default async function SettingPage() {

    const categories = await getAllCategories();
    const cities = await getAllCities();


    return (
        <main>
            <Form categories={categories} cities={cities} />
        </main>
    )
}