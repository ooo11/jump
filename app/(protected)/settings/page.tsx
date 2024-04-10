
import Form from '@/app/(protected)/_components/edit-form';
import { auth } from '@/auth';
import { getAllCategories, getAllCities, getLinkById } from '@/data/seed-data';


export default async function SettingPage() {
    const session = await auth()

    const categories = await getAllCategories();
    const cities = await getAllCities();
    const link = await getLinkById(session?.user.id);

    return (
        <main>
            <Form categories={categories} cities={cities} link={link?.link} />
        </main>
    )
}