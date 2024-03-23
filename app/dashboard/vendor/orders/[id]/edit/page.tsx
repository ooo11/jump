import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers, fetchOrderById, fetchJumpers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Invoice',
};


export default async function Page({ params }: { params: { vendorId: string; id: string } }) {
  const id = params.id;
  const vendorid = params.vendorId
  const [order] = await Promise.all([
    fetchOrderById(id),
  ]);
  if (!order) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Orders', href: `/dashboard/${vendorid}/orders/${id}` },
          {
            label: 'Edit Orders',
            href: `/dashboard/${vendorid}/orders/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form vendorid={vendorid} order={order} />
    </main>
  );
}