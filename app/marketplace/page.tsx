import LandingNav from "@/app/ui/nav-landing";
import Link from "next/link";

export default function Page() {


    return (<main className="flex min-h-screen flex-col p-6">
        <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 md:overflow-visible">
            <div className="-m-6 max-h-[768px] w-[calc(100%+48px)] overflow-scroll lg:overflow-auto">
                <LandingNav />

                <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
                    <div className="flex flex-col justify-center gap-2 rounded-lg bg-gray-50 px-6 py-10 md:w-1/2 md:px-20">

                        <p className={`text-2xl text-button-theme md:text-6xl font-black tracking-tight leading-tight`}>
                            <strong>Marketplace.</strong>
                        </p>
                        <p className={`text-sm text-gray-800 md:text-md md:leading-normal`}>
                            In the future, your shop link will be displayed here. Check out the example of the shop below.
                        </p>
                        <a
                            href="/s/mark"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-2/6 py-3 md:w-2/5 h-12text-sm font-medium text-white bg-button-theme text-center transition-colors hover:bg-button-theme-active md:text-base rounded-[120px]"
                        >Sample shop</a>

                    </div>
                </div>
            </div>
        </div>
    </main >)
}
