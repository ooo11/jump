import { ExtendedUser } from "@/next-auth";
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

        <div
            className="overflow-hidden group rounded-xl p-3 md:p-5 w-full md:w-1/3"
        >
            <div className="w-full flex justify-center items-center">
                {user?.image && isCloudinaryImage(user.image) ? (
                    <CldImage
                        className="w-24 h-24 rounded-full"
                        width={100}
                        height={100}
                        src={`${user.image}?c_fill,g_auto,w_100,h_100`}
                        sizes="100vw"
                        alt="User profile image"
                        crop="fill"
                        priority
                    />
                ) : (
                    <Image
                        className="w-24 h-24 rounded-full"
                        width={100}
                        height={100}
                        src={user?.image || 'https://res.cloudinary.com/dqqwgyyfw/image/upload/v1710001757/n5gcpcacet43cel18w0t.jpg'}
                        alt="User profile image"
                        priority
                    />
                )}


            </div>
            <div className="w-full flex justify-center items-center mt-2">
                <h1 className="text-gray-900  font-bold">
                    {user?.name}
                </h1>
            </div>
            <div className="w-full flex justify-center items-center mt-2">
                <MapPinIcon className="w-3 h-3 mr-1" /><span>{city?.name}</span>
                <span className="mx-2"></span>
                <TagIcon className="w-3 h-3 mr-1" /><span>{category?.name}</span>
            </div>
            <div className="w-full flex justify-center text-center items-center mt-2">
                {user?.about}
            </div>
        </div>
    )
}

