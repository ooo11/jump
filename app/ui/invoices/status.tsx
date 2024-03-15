'use client'
import { CheckIcon, ClockIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useState } from 'react';

export default function OrderStatus({ status }: { status: string }) {
  const [showBubble, setShowBubble] = useState(false);

  const toggleBubble = () => {
    setShowBubble(!showBubble);
    console.log(getStatusTooltip(status));

  };

  return (
    <div className="relative inline-block">
      <span
        onClick={toggleBubble}
        className={clsx(
          'inline-flex items-center rounded-full px-2 py-1 text-xs cursor-pointer',
          {
            'bg-gray-100 text-gray-500': status === 'pending payment',
            'bg-yellow-300 text-white': status === 'paid',
            'bg-violet-500 text-white': status === 'accepted',
            'bg-red-300 text-white': status === 'decline',
            'bg-blue-500 text-white': status === 'delivered',
            'bg-gray-500 text-white': status === 'pending work',
            'bg-green-300 text-white': status === 'complete',
            'bg-red-500 text-white': status === 'incomplete',
            'bg-green-500 text-white': status === 'release payment',
            'bg-red-600 text-white': status === 'report issue',
            'bg-black-500 text-white': status === 'cancelled',
          },
        )}

      >
        {getStatusText(status)}
        {getStatusIcon(status)}

      </span>

      {showBubble && (

        <span className="absolute -top-10 left-1/2 transform md:-translate-x-1/2 flex md:items-center md:w-auto -translate-x-40 w-60 bg-black border border-gray-300 p-2 rounded-md shadow-md text-white">
          <span> <XCircleIcon className='w-5 cursor-pointer hover:fill-red-500	ml-1 mr-2' onClick={toggleBubble} /></span>
          {"  "}{getStatusTooltip(status)}
        </span>
      )}

    </div>
  );
}

// Helper function to return the tooltip text based on status
function getStatusTooltip(status: string): string {
  switch (status) {
    case 'pending payment':
      return 'Customer payment: still missing, still amusing.';
    case 'paid':
      return 'Payment is in, now its your turn to hit the "accept" button! 🎉👀';
    case 'accepted':
      return 'Accepted';
    case 'decline':
      return 'Sorry, job rejected!😔';
    case 'delivered':
      return 'Payment is on hold, waiting for a thumbs-up. If not, we will release it in 3 days! 💸🚀';
    case 'pending work':
      return 'Work is still pending, like a procrastinating cat! 🐱🕰️';
    case 'complete':
      return 'Task completed 🚀';
    case 'incomplete':
      return 'Payment refund to the customer 😭';
    case 'release payment':
      return 'Release Payment';
    case 'report issue':
      return 'Report subbmitted.';
    case 'cancelled':
      return 'Cancelled';
    default:
      return '';
  }
}

// Helper function to return the text to display based on status
function getStatusText(status: string): string {
  switch (status) {
    case 'pending payment':
      return 'Pending Payment';
    case 'paid':
      return 'Paid';
    case 'accepted':
      return 'Accepted';
    case 'decline':
      return 'Decline';
    case 'delivered':
      return 'Delivered';
    case 'pending work':
      return 'Pending Work';
    case 'complete':
      return 'Complete';
    case 'incomplete':
      return 'Incomplete';
    case 'release payment':
      return 'Release Payment';
    case 'report issue':
      return 'Reported';
    case 'cancelled':
      return 'Cancelled';
    default:
      return '';
  }
}

// Helper function to return the corresponding icon based on status
function getStatusIcon(status: string): React.ReactNode {
  switch (status) {
    case 'pending payment':
      return <ClockIcon className="ml-1 w-4 text-gray-500" />;
    case 'paid':
    case 'accepted':
    case 'delivered':
    case 'complete':
    case 'release payment':
      return <CheckIcon className="ml-1 w-4 text-white" />;
    case 'decline':
    case 'incomplete':
    case 'cancelled':
      return <XMarkIcon className="ml-1 w-4 text-white" />;
    case 'pending work':
      return <ClockIcon className="ml-1 w-4 text-white" />;
    case 'report issue':
      return <ExclamationTriangleIcon className="ml-1 w-4 text-white" />;
    default:
      return null;
  }
}
