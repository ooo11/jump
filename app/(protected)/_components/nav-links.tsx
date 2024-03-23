'use client';
import {
  HomeIcon,
  ExclamationCircleIcon,
  BuildingLibraryIcon

} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import clsx from 'clsx';
import { CogIcon, InboxArrowDownIcon, } from '@heroicons/react/20/solid';
import { useCurrentRole } from '@/hooks/use-current-role';
import { UserRole } from '@prisma/client';


export default function NavLinks({ id }: { id: string | undefined }) {
  const pathname = usePathname();

  const role = useCurrentRole();

  const links = [
    { name: 'Home', href: `/dashboard`, icon: HomeIcon },
    {
      name: 'Orders',
      href: `/orders`,
      icon: InboxArrowDownIcon,
    },
    {
      name: 'Settings',
      href: `/settings`,
      icon: CogIcon
    },
    {
      name: 'Help',
      href: `/help`,
      icon: ExclamationCircleIcon
    },
    // Conditionally include the Admin link based on the user's role
    ...(role === UserRole.ADMIN ? [{
      name: 'Admin',
      href: `/admin`,
      icon: BuildingLibraryIcon
    }] : []),

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
          </Link>
        );
      })}
    </>
  );
}
