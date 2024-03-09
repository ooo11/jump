'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import the useRouter hook
import ReactCalendar from 'react-calendar';
import { add, format } from 'date-fns';

interface DateType {
    justDate: Date | null
    dateTime: Date | null
}


export function Calendar() {
    const router = useRouter();
    const [date, setDate] = useState<DateType>({
        justDate: null,
        dateTime: null
    });

    console.log(date.dateTime);

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

    const handleTimeSelection = (selectedTime: Date) => {
        setDate((prev) => ({ ...prev, dateTime: selectedTime }));

        // Navigate to the form page with the selected date and time
        router.push(`/guest/newguest?dateTime=${selectedTime.toISOString()}`);
    }


    return (
        <div>
            {date.justDate ? (
                <div className='flex max-w-lg flex-wrap gap-4'>
                    {times?.map((time, i) => (
                        <div className='rounded-sm bg-gray-100 p-2' key={`time-${i}`}>
                            <button onClick={() => handleTimeSelection(time)} type='button'>
                                {format(time, 'kk:mm')}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <ReactCalendar minDate={new Date()}
                    className='REACT-CALENDAR p2'
                    view='month'
                    calendarType='gregory'
                    onClickDay={(date) => setDate((prev) => ({ ...prev, justDate: date }))}
                />
            )}

        </div>
    )
}