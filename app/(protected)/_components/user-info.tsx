import { ExtendedUser } from "@/next-auth";
import { lusitana } from '@/app/ui/fonts';
import { CldImage } from 'next-cloudinary';
import { MapPinIcon, TagIcon } from "@heroicons/react/24/outline";
import { Category } from "@prisma/client";
import Image from "next/image";

interface UserInfoProps {
    user?: ExtendedUser;
    city?: City | null; // Include city here as optional or nullable
    category?: Category | null;
}

type City = {
    id: string;
    name: string;
};

export const UserInfo = ({
    user,
    city,
    category
}: UserInfoProps
) => {
    const isCloudinaryImage = (imageUrl: string) => imageUrl.includes("cloudinary.com");


    return (
        <div>
            <div className="mt-5 flex w-full justify-center">
                {user?.image && isCloudinaryImage(user.image) ? (
                    <CldImage
                        className="w-24 h-24 rounded-full"
                        width={100}
                        height={100}
                        src={user.image}
                        sizes="100vw"
                        alt="User profile image"
                        priority
                    />
                ) : (
                    <Image
                        className="w-24 h-24 rounded-full"
                        width={100}
                        height={100}
                        src={user?.image || 'https://res.cloudinary.com/dqqwgyyfw/image/upload/v1710001757/n5gcpcacet43cel18w0t.jpg'}
                        alt="User profile image"
                    />
                )}
            </div>
            <h1 className={`${lusitana.className} text-xl md:text-2xl mt-5 flex w-full justify-center`}>
                {user?.name}
            </h1>
            <p className="flex w-full justify-center text-gray-400">
                <MapPinIcon className="w-5 h-5" />{city?.name}
                <TagIcon className="w-5 h-5" />{category?.name}
            </p>

            <div className="mt-5 flex w-full justify-center">
                <p className='md:w-500 sm:w-full sm:mx-2'>
                    {user?.about}
                </p>
            </div>
        </div>
    )
}