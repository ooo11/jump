
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Customer List',
};


export default async function Page({
    searchParams,
}: {
    searchParams?: {
        query: string;

    }
}) {


    const query = searchParams?.query || '';

    return (
        <div className="w-full">

            <div className="mt-5 flex w-full justify-center">
                <p>This is the Setting Page ⚙️</p>
            </div>
        </div>
    );
}