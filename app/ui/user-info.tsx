import { ExtendedUser } from "@/next-auth";
import { lusitana } from '@/app/ui/fonts';
import { CldImage } from 'next-cloudinary';

interface UserInfoProps {
    user?: ExtendedUser,

}

export const UserInfo = ({
    user,
}: UserInfoProps) => {
    return (
        <div>
            <div className="mt-5 flex w-full justify-center">
                <CldImage
                    className="w-24 h-24 rounded-full"
                    width="100"
                    height="100"
                    src={user?.image || 'https://res.cloudinary.com/dqqwgyyfw/image/upload/v1710001757/n5gcpcacet43cel18w0t.jpg'}
                    sizes="100vw"
                    alt="Description of my uploaded image"
                    priority
                />
            </div>
            <h1 className={`${lusitana.className} text-xl md:text-2xl mt-5 flex w-full justify-center`}>
                {user?.name}
            </h1>
            <p className="flex w-full justify-center text-gray-400">
                {user?.email} {user?.role}
            </p>

            <div className="mt-5 flex w-full justify-center">
                <p className='md:w-1/4 sm:w-full sm:mx-2'>
                    Here is all about {user?.name}
                </p>
            </div>
        </div>
    )
}