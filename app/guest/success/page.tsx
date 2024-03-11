
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';


export const metadata: Metadata = {
    title: 'Guest Success',
};





export default async function Page() {


    return (

        <main className="flex flex-col justify-center items-center min-h-screen bg-teal-200">
            <p className="text-xl text-gray-500 mb-6">✨✨✨Your order is placed!✨✨✨</p>
            <Link
                href="/guest"
                className="rounded-lg bg-yellow-300 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-yellow-400 md:text-base"
            >
                <span>See the Guest Homepage</span> <ArrowRightIcon className="w-5 md:w-6" />
            </Link>
        </main>

    );
}