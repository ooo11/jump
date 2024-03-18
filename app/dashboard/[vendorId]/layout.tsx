
// import SideNav from '@/app/ui/dashboard/sidenav';



// export default async function Layout({ children, params }: { children: React.ReactNode, params: { vendorId: string } }) {
//   const id = params.vendorId


//   return (
//     <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
//       <div className="w-full flex-none md:w-64">
//         <SideNav id={id} />
//       </div>
//       <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
//     </div>
//   );
// }

import { fetchVendorByIdFront } from '@/app/lib/data';
import SideNav from '@/app/ui/dashboard/sidenav';
import { notFound } from 'next/navigation'; // Importing notFound from next/navigation

export default async function Layout({ children, params }: { children: React.ReactNode, params: { vendorId: string } }) {
  const id = params.vendorId;

  // Fetch the vendor data
  const vendor = await fetchVendorByIdFront(id);

  // If vendor does not exist, return 404
  if (!vendor) {
    notFound();
  }

  // Render the layout
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      {/* Only render the sidebar if the vendor exists */}
      {vendor && (
        <div className="w-full flex-none md:w-64">
          <SideNav id={id} />
        </div>
      )}
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
