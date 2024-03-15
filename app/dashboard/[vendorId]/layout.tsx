
import { fetchOrdersByVendorId } from '@/app/lib/data';
import SideNav from '@/app/ui/dashboard/sidenav';



export default async function Layout({ children, params }: { children: React.ReactNode, params: { vendorId: string } }) {
  const id = params.vendorId

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav id={id} />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}