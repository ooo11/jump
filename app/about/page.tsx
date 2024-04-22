import LandingNav from "@/app/ui/nav-landing";

export default function Page() {


    return (<main className="flex min-h-screen flex-col p-6">
        <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 md:overflow-visible">
            <div className="-m-6 max-h-[768px] w-[calc(100%+48px)] overflow-scroll lg:overflow-auto">
                <LandingNav />

                <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
                    <div className="flex flex-col justify-center gap-2 rounded-lg bg-gray-50 px-6 py-10 md:w-1/2 md:px-20">

                        <p className={`text-2xl text-button-theme md:text-6xl font-black tracking-tight leading-tight`}>
                            <strong> About Jumpsay.</strong>
                        </p>
                        <p className={`text-sm text-gray-800 md:text-md md:leading-normal`}>
                            Jumpsay enables you to showcase your service via a single link, enhancing the visibility of your online store, simplifying its management, and increasing its potential to generate sales.
                        </p>


                    </div>
                </div>
            </div>
        </div>
    </main >)
}
