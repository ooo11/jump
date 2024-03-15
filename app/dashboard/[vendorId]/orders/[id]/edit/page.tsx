import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers, fetchOrderById, fetchJumpers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Invoice',
};


export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
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
          { label: 'Orders', href: `/dashboard/${id}/orders` },
          {
            label: 'Edit Orders',
            href: `/dashboard/orders/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form order={order} />
    </main>
  );
}