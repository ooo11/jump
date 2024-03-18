"use client"

import { BellAlertIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteInvoice, deleteOrderAdmin } from '@/app/lib/actions';
import Link from 'next/link';
import { useState } from 'react';

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ vendorId, id, children }: { vendorId: string; id: string; children?: React.ReactNode }) {
  return (

    <Link
      href={`/dashboard/${vendorId}/orders/${id}/edit`}
      className="rounded-md border p-2 bg-black text-white hover:bg-gray-800"
    >
      Update status
    </Link>

  );
}

export function UpdateAdminOrder({ id, children }: { id: string; children?: React.ReactNode }) {
  return (

    <Link
      href={`/dashboard/admin/orders/${id}/edit`}
      className="rounded-md border p-2 bg-black text-white hover:bg-gray-800"
    >
      <BellAlertIcon className="w-4" />
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

export function DeleteAdminOrder({ id }: { id: string }) {
  const [isConfirming, setIsConfirming] = useState(false);

  const deleteOrderWithId = () => {
    if (isConfirming) {
      deleteOrderAdmin(id);
    } else {
      setIsConfirming(true);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); }}>
      {isConfirming ? (
        <>
          <p>Delete this order forever?</p>
          <button
            className="rounded-md border p-2 bg-red-500 text-white mr-2"
            onClick={deleteOrderWithId}
          >
            Confirm
          </button>
          <button
            className="rounded-md border p-2 bg-gray-200 text-gray-700"
            onClick={() => setIsConfirming(false)}
          >
            Cancel
          </button>
        </>
      ) : (
        <button className="rounded-md border p-2 hover:bg-gray-100" onClick={deleteOrderWithId}>
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-4" />
        </button>
      )}
    </form>
  );
}