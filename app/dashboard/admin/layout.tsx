
import SideNav from '@/app/ui/admin/sidenav';
import { notFound } from 'next/navigation'; // Importing notFound from next/navigation

export default async function Layout({ children }: { children: React.ReactNode }) {


  // Render the layout
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      {/* Only render the sidebar if the vendor exists */}

      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>

      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
