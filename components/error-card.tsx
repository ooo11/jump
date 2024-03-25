

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export const ErrorCard = () => {
  return (
    <div>
      <div className="w-full flex justify-center items-center">
        <ExclamationCircleIcon className="w-10 h-10" />
        Oops! Something went wrong!
        <Link
          href="/auth/login" >Back to login</Link>
      </div>
    </div>
  );
};
