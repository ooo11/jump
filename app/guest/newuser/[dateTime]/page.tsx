import { fetchCity } from '@/app/lib/data';
import Form from '@/app/ui/guest/user-registration-form';
import { Metadata } from 'next';

interface PageProps {
    query: {
        dateTime: string;
    };
}

export const metadata: Metadata = {
    title: 'Create New User',
};

export default async function Page({ query }: PageProps) {
    const [city] = await Promise.all([fetchCity()]);

    // Extract date and time from query parameters
    const dateTime = query.dateTime;

    return (
        <div className="mt-5 flex w-full justify-center">
            <Form cities={city} selectedDateTime={dateTime} />
        </div>
    );
}
