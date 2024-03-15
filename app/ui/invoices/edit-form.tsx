'use client';
import { updateInvoice, updateOrderStatus } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { CustomerField, InvoiceForm, Jumpers, Orders, latestOrders } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

export default function EditInvoiceForm({
  order
}: {
  order: latestOrders;
}) {
  const initialState = { message: null, errors: {} };
  const updateOrderWithId = updateOrderStatus.bind(null, order.id);
  const [state, dispatch] = useFormState(updateOrderWithId, initialState);

  //todo make a conditional form for each status. and  admin form. 


  // Conditionally render the form
  if (order.status === 'pending payment') {
    return (
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <p className="text-gray-600">We&#39;re basically doing the &#34;waiting dance&#34; until the customer pays up! 🕺🕺🕺 💸 💸 💸</p>
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/orders"
            className="flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Back
          </Link>
        </div>
      </div>

    );
  };

  if (order.status === 'delivered') {
    return (
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <p className="text-gray-600">We&#39;re hanging on to see what the customer says before we let go of the cash. If they don&#39;t speak up, we&#39;re setting it free in three days! 📢 📢 📢 💬 💰 💰 💰</p>
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/orders"
            className="flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Back
          </Link>
        </div>
      </div>

    );
  }

  if (order.status === 'paid') {
    return (
      <form action={dispatch}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Invoice Status */}
          <fieldset>
            <legend className="mb-2 block text-sm font-medium">
              Set the Order status
              <span>{order.status}</span>
            </legend>
            <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
              <div className="flex gap-4">
                <div className="flex items-center">
                  <input
                    id="accepted"
                    name="status"
                    type="radio"
                    value="accepted"
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                    aria-describedby="status-error-p"
                  />
                  <label
                    htmlFor="accepted"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                  >
                    Accept <ClockIcon className="h-4 w-4" />
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="decline"
                    name="status"
                    type="radio"
                    value="decline"
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                    aria-describedby="status-error"
                  />
                  <label
                    htmlFor="decline"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    Decline <CheckIcon className="h-4 w-4" />
                  </label>
                </div>
              </div>

              <div id="status-error" aria-live="polite" aria-atomic="true">
                {state.errors?.status &&
                  state.errors.status.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>

              <div id="missing-field-error" aria-live="polite" aria-atomic="true">
                <p className="mt-2 text-sm text-red-500" >
                  {state.message}
                </p>

              </div>


            </div>
          </fieldset>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/orders"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit">Update Status</Button>
        </div>
      </form>
    );
  }

  if (order.status === 'accepted') {
    return (
      <form action={dispatch}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Invoice Status */}
          <fieldset>
            <legend className="mb-2 block text-sm font-medium">
              Set the Order status
              <span>{order.status}</span>
            </legend>
            <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
              <div className="flex gap-4">
                <div className="flex items-center">
                  <input
                    id="incomplete"
                    name="status"
                    type="radio"
                    value="incomplete"
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                    aria-describedby="status-error-p"
                  />
                  <label
                    htmlFor="incomplete"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                  >
                    Incomplete <XMarkIcon className="h-4 w-4" />
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="delivered"
                    name="status"
                    type="radio"
                    value="delivered"
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                    aria-describedby="status-error"
                  />
                  <label
                    htmlFor="delivered"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    Delivered <CheckIcon className="h-4 w-4" />
                  </label>
                </div>
              </div>

              <div id="status-error" aria-live="polite" aria-atomic="true">
                {state.errors?.status &&
                  state.errors.status.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>

              <div id="missing-field-error" aria-live="polite" aria-atomic="true">
                <p className="mt-2 text-sm text-red-500" >
                  {state.message}
                </p>

              </div>


            </div>
          </fieldset>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/orders"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit">Update Status</Button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <p className="text-gray-600">This form is not available to be updated.</p>
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/orders"
            className="flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Back
          </Link>
        </div>
      </div>

    </div>
  )

}
