'use client'
import { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Import the useRouter hook
import ReactCalendar from 'react-calendar';
import { add, format } from 'date-fns';


interface DateType {
    justDate: Date | null
    dateTime: Date | null
}


export function Calendar({ packageId, vendorURL }: { packageId: string, vendorURL: string }) {
    const searchParams = useSearchParams()
    const router = useRouter();
    const [date, setDate] = useState<DateType>({
        justDate: null,
        dateTime: null
    });


    const handleTimeSelection = useCallback((selectedTime: Date) => {
        if (!date.justDate) {
            // Handle the case where date.justDate is null
            console.error('No date selected');
            return;
        }

        // Combine date and time and format it as needed
        const selectedDateTime = new Date(date.justDate);
        selectedDateTime.setHours(selectedTime.getHours());
        selectedDateTime.setMinutes(selectedTime.getMinutes());

        // Build the URLSearchParams
        const params = new URLSearchParams(searchParams.toString())
        params.set('datetime', selectedDateTime.toISOString());

        // Redirect to the form page with date and time as query parameters
        router.push(`/${vendorURL}/newuser?${params.toString()}&package=${packageId}`);
    }, [date.justDate, packageId, router, searchParams, vendorURL]
    );

    const getTimes = () => {
        if (!date.justDate) return
        const { justDate } = date
        const beginning = add(justDate, { hours: 8 })
        const end = add(justDate, { hours: 21 })
        const interval = 30

        const times = []
        for (let i = beginning; i <= end; i = add(i, { minutes: interval })) {
            times.push(i)
        }

        return times

    }

    const times = getTimes();



    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <p className='mb-10'>Select Date and Time ⏰</p>

            {date.justDate ? (
                <div className='flex max-w-xs sm:max-w-lg flex-wrap gap-4'>

                    {times?.map((time, i) => (
                        <div className='rounded-sm bg-gray-100 p-2 hover:bg-violet-500' key={`time-${i}`}>
                            <button onClick={() => handleTimeSelection(time)} type='button'>
                                {format(time, 'kk:mm')}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <ReactCalendar minDate={new Date()}
                    className='REACT-CALENDAR p-20 sm:p-4 p2'
                    view='month'
                    calendarType='gregory'
                    onClickDay={(date) => setDate((prev) => ({ ...prev, justDate: date }))}
                />
            )}

        </div>
    )
}