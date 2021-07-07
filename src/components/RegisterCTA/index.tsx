import React from 'react'
import Image from "next/image";
import Link from 'next/link';

const CTAButton = ({ link, children }: { link: string, children: string }) => {
    return (
        <div className="rounded-md shadow">
            <Link href={link}>
                <a
                    className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-gray-900 bg-white border border-transparent rounded-md hover:bg-gray-50"
                >
                    {children}
                </a>
            </Link>
        </div>
    )
}

export const RegisterCTA = () => {
    return (
        <div className="relative overflow-hidden bg-gray-800 rounded-lg">
            <div className="relative h-56 sm:h-72 md:absolute md:left-0 md:h-full md:w-1/2">
                <Image
                    src="/cta.svg"
                    alt="category items"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t md:bg-gradient-to-l from-gray-800 to-gray-transparent"></div>
            </div>
            <div className="relative px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-16">
                <div className="md:ml-auto md:w-1/2 md:pl-10">
                    <p className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Register now and let's rent and borrow space
                    </p>
                    <p className="mt-3 text-gray-400 text-md">
                        たったの1分で簡単登録。もちろん登録は無料です。
                    </p>
                    <div className="flex mt-8 space-x-4">
                        <CTAButton link="/auth/register">アカウント登録する</CTAButton>
                        <CTAButton link="/about-us">スペース掲載について</CTAButton>
                    </div>
                </div>
            </div>
        </div>
    )
}