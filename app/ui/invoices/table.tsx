import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency, formatTimeToLocal } from '@/app/lib/utils';
import { fetchFilteredOrders } from '@/app/lib/data';
import OrderStatus from '@/app/ui/invoices/status';

export default async function InvoicesTable({
  query,
  currentPage,
  vendorId,
}: {
  query: string;
  currentPage: number;
  vendorId: string;
}) {
  const orders = await fetchFilteredOrders(query, currentPage, vendorId);
  console.log("table herer ", vendorId);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {orders?.map((order) => (
              <div
                key={order.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{order.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{order.email}</p>
                  </div>
                  <OrderStatus status={order.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(order.price / 100)}
                    </p>
                    <p>
                      {order.packagename} <br />
                      {formatDateToLocal(order.datetime)} <br />
                      {formatTimeToLocal(order.datetime)} <br />
                      {order.city}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    {(order.status === 'paid' || order.status === 'accepted') && (
                      <UpdateInvoice vendorId={vendorId} id={order.id} />
                    )}

                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Contact
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Package
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Location & Time
                </th>

                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {orders?.map((order) => (
                <tr
                  key={order.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{order.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {order.email} <br />
                    {order.phone}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {order.packagename}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(order.price / 100)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {order.packagename} <br />
                    {formatDateToLocal(order.datetime)} <br />
                    {formatTimeToLocal(order.datetime)} <br />
                    {order.city}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3">
                    <OrderStatus status={order.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      {(order.status === 'paid' || order.status === 'accepted') && (
                        <UpdateInvoice vendorId={vendorId} id={order.id} />
                      )}

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
