import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deletePackages } from '@/app/lib/actions';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/20/solid';

export function CreatePackages({ vendorId }: { vendorId: string }) {
  return (
    <Link
      href={`/dashboard/${vendorId}/packages/create`}
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Package</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function GoToHomepage({ url }: { url: string }) {
  return (

    <a target="_blank" href={`/${url}`}
      className="flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
      rel="noopener noreferrer">
      <span className="hidden md:block">See what your customers see 👁️ </span>
      <ArrowRightIcon className="h-5 md:ml-4" />
    </a>

  );
}

export function UpdatePackage({ vendorId, id }: { vendorId: string, id: string }) {
  return (
    <Link
      href={`/dashboard/${vendorId}/packages/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeletePackage({ id }: { id: string }) {
  const deletePackageWithId = deletePackages.bind(null, id);
  return (
    <form action={deletePackageWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}

export function SelectPackage({ vendorId, id }: { vendorId: string, id: string }) {
  return (
    <Link
      href={`/dashboard/${vendorId}/package/${id}/select`}

    >
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add to cart
      </button>
    </Link>
  );
}

export function SelectPackageDisable() {
  return (

    <button className="bg-blue-500 text-white bg-gray-300 font-bold py-2 px-4 rounded focus:outline-none" disabled>
      Add to cart
    </button>

  );
}
