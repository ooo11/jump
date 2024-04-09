

import { CldImage } from 'next-cloudinary';
import { MapPinIcon, TagIcon } from "@heroicons/react/24/outline";
import { Category } from "@prisma/client";
import Image from "next/image";

interface User {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    about: string | null;
    cityId: string | null;
    categoryId: string | null;
}

interface UserInfoProps {
    user: User | null;
    city?: City | null; // Include city here as optional or nullable
    category?: Category | null;
}

type City = {
    id: string;
    name: string;
};

export const VendorInfo = ({
    user,
    city,
    category
}: UserInfoProps
) => {
    const isCloudinaryImage = (imageUrl: string) => imageUrl.includes("cloudinary.com");


    return (

        <div
            className="bg-gray-100 relative overflow-hidden group rounded-xl p-3 md:p-5 w-full md:w-1/2"
        >
            <div className="flex items-center gap-4">
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
                <div className="w-fit ">
                    <h1 className="text-gray-900  font-bold">
                        {user?.name}
                    </h1>
                    <p className="text-gray-700">{user?.email}</p>
                    <a
                        className="text-xs text-gray-800  ">
                        <div className="flex items-center space-x-1">
                            <MapPinIcon className="w-5 h-5" />
                            <span>{city?.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <TagIcon className="w-5 h-5" />
                            <span>{category?.name}</span>
                        </div>
                    </a>

                </div>

            </div>
            <div className="flex items-center mt-4">
                {user?.about}
            </div>
        </div>
    )
}

