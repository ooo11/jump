import Table from '@/app/ui/customers/table';
import { lusitana } from '@/app/ui/fonts';
import { TableRowSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer List',
};

 
export default async function Page({
 searchParams,
}: {
searchParams?: {
    query: string;

}
}) {

 
  const query = searchParams?.query || '';

  return (
    <div className="w-full">
     
     
        <Table  query={query} />

      <div className="mt-5 flex w-full justify-center">
        
      </div>
    </div>
  );
}