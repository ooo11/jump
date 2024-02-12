import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteInvoice } from '@/app/lib/actions';
import Link from 'next/link';
import { Cog8ToothIcon } from '@heroicons/react/20/solid';



export function UpdateVendor({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/vendors/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      Update Vendor Details
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);
  return (
    <form action={deleteInvoiceWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}
