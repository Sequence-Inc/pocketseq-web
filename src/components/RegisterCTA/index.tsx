import React from "react";
import Link from "next/link";
import Image from "next/image";

const CTAButton = ({ link, children }: { link: string; children: string }) => {
    return (
        <Link href={link}>
            <a className="inline-flex items-center justify-center px-5 py-2 text-base font-medium text-gray-600 bg-white border border-transparent rounded-md hover:bg-gray-50 shadow">
                {children}
            </a>
        </Link>
    );
};

export const RegisterCTA = () => {
    return (
        <div className="relative overflow-hidden bg-gray-800 rounded-2xl">
            <div className="relative h-56 sm:h-72 md:absolute md:left-0 md:h-full md:w-1/2">
                <Image
                    layout="fill"
                    src="/cta-bg.jpg"
                    className="h-full w-full object-cover"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t md:bg-gradient-to-l from-gray-800 to-gray-transparent"></div>
            </div>
            <div className="relative px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-16">
                <div className="md:ml-auto md:w-1/2 md:pl-10">
                    <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                        会員登録すればいろいろな体験とお気に入りの場所が見つかります。
                    </p>
                    <p className="mt-5 text-gray-400 text-md">
                        無料登録でスペースや技術を借りたり提供したりしてみよう
                    </p>
                    <div className="flex mt-10 space-x-4">
                        <CTAButton link="/auth/host-register">
                            借りたい人はこちら
                        </CTAButton>
                        <CTAButton link="/services">
                            提供したい人はこちら
                        </CTAButton>
                    </div>
                </div>
            </div>
        </div>
    );
};
