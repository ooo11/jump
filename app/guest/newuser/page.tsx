import { fetchCity } from '@/app/lib/data';
import Form from '@/app/ui/guest/user-registration-form';
import { Metadata } from 'next';
import { useSearchParams } from 'next/navigation';



export const metadata: Metadata = {
    title: 'Create New User',
};

export default async function Page() {
    const [city] = await Promise.all([fetchCity()]);


    return (
        <div className="mt-5 flex w-full justify-center">
            <Form cities={city} />
        </div>
    );
}
