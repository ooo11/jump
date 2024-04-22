"use client"

import Link from 'next/link';
import { useState } from 'react';


export default function LandingNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='mt-4 md:mt-10'>
            <nav className="sticky top-0 z-10 block w-full max-w-full px-4 py-2 text-white bg-white border rounded-3xl md:rounded-full h-max border-black  backdrop-blur-2xl backdrop-saturate-200 md:px-8 md:py-4">
                <div className="flex items-center justify-between text-gray-900">
                    <Link href="/"
                        className="mr-4 block cursor-pointer py-1.5 font-sans text-base font-semibold leading-relaxed text-inherit antialiased">
                        Jumpsay
                    </Link>
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="hidden mr-4 md:block">
                            <ul className="flex flex-col gap-2 mt-2 mb-4 md:mb-0 md:mt-0 md:flex-row md:items-center md:gap-6">
                                <li className="block p-1 font-sans text-md antialiased font-normal leading-normal text-gray-900">
                                    <Link href="/marketplace" className="flex items-center">
                                        Marketplace
                                    </Link>
                                </li>
                                <li className="block p-1 font-sans text-md antialiased font-normal leading-normal text-gray-900">
                                    <Link href="/about" className="flex items-center">
                                        About us
                                    </Link>
                                </li>
                                <li className="block p-1 font-sans text-md antialiased font-normal leading-normal text-gray-900">
                                    <Link href="/pricing" className="flex items-center">
                                        Pricing
                                    </Link>
                                </li>

                            </ul>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <Link
                                href="/auth/login"
                                className="flex items-center gap-5 self-start rounded-lg bg-gray-300 px-4 md:px-6 py-3 text-sm font-medium transition-colors hover:bg-gray-200 md:text-base"
                            >
                                <span>Login</span>
                            </Link>
                            <Link
                                href="/auth/register"
                                className="flex items-center gap-5 self-start rounded-3xl bg-button-theme px-4 md:px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-button-theme-active md:text-base"
                            >
                                <span>Register</span>
                            </Link>
                        </div>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="relative ml-auto h-6 max-h-[40px] w-5 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none md:hidden"
                            type="button">
                            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                {isOpen ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 bg-red-500 rounded-full text-white" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
                                    </svg>
                                )}
                            </span>
                        </button>

                    </div>
                </div>
            </nav>
            <div className={`md:flex items-center gap-6 ${isOpen ? 'flex' : 'hidden'} flex-col md:hidden left-0 w-full md:w-auto bg-black text-white p-4 rounded-xl mt-4`}>
                <Link href="/marketplace" className="p-1 py-6 w-full text-md font-semibold leading-normal active:bg-button-theme-active active:text-black ">
                    Marketplace
                </Link>
                <Link href="/about" className="p-1 py-6 w-full font-semibold font-normal leading-normal active:bg-button-theme-active active:text-black ">
                    About us
                </Link>
                <Link href="/pricing" className="p-1 py-6 w-full font-semibold font-normal leading-normal active:bg-button-theme-active active:text-black ">
                    Pricing
                </Link>
            </div>
        </div>
    );
}
