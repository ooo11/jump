

import Image from "next/image";
import Link from "next/link";

export const ErrorPageNotFound = () => {
  return (
    <div>
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <Image

          width={500}
          height={500}
          src="https://imgcdn.jumpsay.com/6999704_592.svg"
          alt="404 Error Page Not Found"
          priority
        />
        <div className="flex flex-col items-center justify-center">
          <p className="text-3xl md:text-4xl lg:text-5xl text-gray-800 mt-12"> Page not found</p>
          <Link
            className="mt-10 rounded-3xl bg-button-theme px-4 md:px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-button-theme-active md:text-base"
            href="/" >Back to homepage</Link>
        </div>
      </div>
    </div>
  );
};
