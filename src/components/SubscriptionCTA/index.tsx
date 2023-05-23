import React from "react";
import Link from "next/link";

const CTAButton = ({ link, children }: { link: string; children: string }) => {
    return (
        <Link href={link}>
            <a className="inline-flex items-center justify-center px-5 py-2 text-base text-primary hover:text-primary bg-white border border-transparent rounded-md hover:bg-gray-100 shadow">
                {children}
            </a>
        </Link>
    );
};

export const SubscriptionCTA = () => {
    return (
        <div className="relative overflow-hidden bg-primary rounded-2xl">
            <div className="relative h-56 sm:h-72 md:absolute md:left-0 md:h-full md:w-1/2">
                <img
                    src="/cta-subscription-bg.jpg"
                    className="h-full w-full object-cover"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t md:bg-gradient-to-l from-primary to-gray-transparent"></div>
            </div>
            <div className="relative px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-16">
                <div className="md:ml-auto md:w-1/2 md:pl-10">
                    <div className="mt-2 text-3xl font-bold tracking-tight text-white">
                        サブスクリプションのご案内
                    </div>
                    <div className="mt-5 text-gray-50 text-md">
                        定額制でスペースレンタル・宿泊利用を始めよう
                    </div>
                    <div className="flex mt-10 space-x-4">
                        <CTAButton link="/subscription">
                            詳しくはこちら
                        </CTAButton>
                        <CTAButton link="/subscription">登録はこちら</CTAButton>
                    </div>
                </div>
            </div>
        </div>
    );
};
