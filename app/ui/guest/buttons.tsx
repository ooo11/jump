import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deletePackages } from '@/app/lib/actions';
import Link from 'next/link';


export function SelectGuestPackage({ id, url }: { id: string, url: string }) {
  return (
    <Link
      href={`/${url}/packages/${id}/select`}

    >
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Select Package
      </button>
    </Link>
  );
}