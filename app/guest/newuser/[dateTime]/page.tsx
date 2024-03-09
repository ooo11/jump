import { fetchCity } from '@/app/lib/data';
import Form from '@/app/ui/guest/user-registration-form';
import { Metadata } from 'next';

interface PageProps {
    params: { dateTime: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export const metadata: Metadata = {
    title: 'Create New User',
};

export default async function Page({ params, searchParams }: PageProps) {
    const [city] = await Promise.all([fetchCity()]);

    // Extract date and time from query parameters
    const dateTime = params.dateTime;

    return (
        <div className="mt-5 flex w-full justify-center">
            <Form cities={city} selectedDateTime={dateTime} />
        </div>
    );
}
