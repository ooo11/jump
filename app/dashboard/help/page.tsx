
import { Calendar } from '@/app/ui/packages/Calendar/calendar';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Help Page',
};


export default async function Page() {

    return (
        <div className="w-full">

            <div className="mt-5 flex w-full justify-center">
                <p> This page is for the needs 🚑 🚒</p>
            </div>
        </div>
    );
}