
import { Calendar } from '@/app/ui/packages/Calendar/calendar';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Select',
};


export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    console.log(id);

    return (
        <div className="w-full">

            <div className="mt-5 flex w-full justify-center">
                <Calendar />
            </div>
        </div>
    );
}