import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image'

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">

      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">

          <p className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Welcome to Jumpsay</strong>
          </p>
          <Link
            href="/dashboard/46f6b95b-067b-4553-af41-2a3f572b86c8"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>See the Dashboard For Meow Down Under Studio</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
          <Link
            href="/dashboard/57c76c6a-a085-4bfc-89de-b07850d17a6f"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>See the Dashboard For Vue Studio</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
          <Link
            href="/chopchop"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>See the Meow Down Under Studio Homepage</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
          <Link
            href="/vuestudio"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>See the Vue Studio Homepage</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>

          <Link
            href="/dashboard/admin"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>See the Admin Homepage</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>


          <Link
            href="/auth/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Login</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>

        </div>

      </div>
    </main>
  );
}
