import Image from "next/image";

export default function PackageCard() {
    return (
        <div>

            <div className="!z-5 relative flex flex-col rounded-[20px] max-w-[300px] bg-white bg-clip-border hover:shadow-3xl m-4 flex flex-col !p-4 3xl:p-![18px] bg-white">
                <div className="h-full w-full">
                    <div className="relative w-full">
                        <Image src="https://res.cloudinary.com/dqqwgyyfw/image/upload/v1711342435/c4tqpriojaqfo6h4htqb.png"
                            className="mb-3 h-full w-full rounded-xl 3xl:h-full 3xl:w-full" alt="mmm" width="100" height="100" />

                    </div>
                    <div className="mb-3 flex items-center justify-between px-1 md:items-start">
                        <div className="mb-2">
                            <p className="text-lg font-bold text-navy-700"> Abstract Colors </p>
                            <p className="mt-1 text-sm font-medium text-gray-600 md:mt-2">By Esthera Jackson </p>
                        </div>
                        <div className="flex flex-row-reverse md:mt-2 lg:mt-0">

                        </div>
                    </div>
                    <div className="flex items-center justify-between md:items-center lg:justify-between ">
                        <div className="flex">
                            <p className="!mb-0 text-sm font-bold text-blue-500">Current Bid: 0.91 <span>ETH</span></p>
                        </div>
                        <button className="linear rounded-[20px] bg-blue-900 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-blue-800 active:bg-blue-700">Place Bid</button>
                    </div>
                </div>
            </div>

        </div>

    );
}
