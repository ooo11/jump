import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deletePackages } from '@/app/lib/actions';
import Link from 'next/link';


export function SelectGuestPackage({ id }: { id: string }) {
  return (
    <Link
      href={`/guest/packages/${id}/select`}

    >
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Select Package
      </button>
    </Link>
  );
}

export function CreateUser() {
  return (
    <Link
      href="/guest/newuser"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Register New User</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}
