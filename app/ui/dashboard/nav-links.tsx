'use client';
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  CubeIcon,
  NewspaperIcon,
  ExclamationCircleIcon

} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import clsx from 'clsx';
import { CogIcon, InboxArrowDownIcon, } from '@heroicons/react/20/solid';
import { orderStatus } from '@/app/lib/definitions';

// const id = '57c76c6a-a085-4bfc-89de-b07850d17a6f'

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
// const links = [
//   { name: 'Home', href: `/dashboard/${id}`, icon: HomeIcon },
//   {
//     name: 'Orders',
//     href: `/dashboard/${id}/orders`,
//     icon: InboxArrowDownIcon,
//   },
//   {
//     name: 'Settings',
//     href: `/dashboard/${id}/settings`,
//     icon: CogIcon
//   },
//   {
//     name: 'Help',
//     href: '/dashboard/help',
//     icon: ExclamationCircleIcon
//   },

// ];
// { orders }: { orders: orderStatus[] }
export default function NavLinks({ id }: { id: string }) {
  const pathname = usePathname();
  // Check if any order has status 'paid' or 'accepted'
  // const hasNotification = orders.some((order: { status: string; }) => order.status === 'paid' || order.status === 'accepted');
  const links = [
    { name: 'Home', href: `/dashboard/${id}`, icon: HomeIcon },
    {
      name: 'Orders',
      href: `/dashboard/${id}/orders`,
      icon: InboxArrowDownIcon,
    },
    {
      name: 'Settings',
      href: `/dashboard/${id}/settings`,
      icon: CogIcon
    },
    {
      name: 'Help',
      href: `/dashboard/${id}/help`,
      icon: ExclamationCircleIcon
    },

  ];

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
            {/* {link.name === 'Orders' && hasNotification && <div className="w-3 h-3 rounded-full bg-red-500"></div>} */}
          </Link>
        );
      })}
    </>
  );
}
