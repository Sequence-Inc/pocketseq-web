import React from "react";
import Link from "next/link";
import Image from "next/image";

const CTAButton = ({ link, children }: { link: string; children: string }) => {
    return (
        <Link href={link}>
            <a className="inline-flex items-center justify-center px-5 py-2 text-base font-medium text-white hover:text-gray-600 bg-[#007A74] border border-transparent rounded-md shadow hover:bg-gray-50">
                {children}
            </a>
        </Link>
    );
};

export const RegisterCTAGuest = () => {
    return (
        <div className="relative overflow-hidden bg-primary rounded-2xl">
            <div className="relative px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-20">
                <div className="md:mr-auto md:w-1/2 md:pr-10">
                    <div className="mt-2 text-right text-3xl font-bold tracking-tight text-white">
                        レンタル（体験する）
                    </div>
                    <div className="mt-5 text-right text-white text-md">
                        ～目的にあったスペースを探すことができる～
                    </div>
                    <div className="mt-5 text-right text-white text-md">
                        ～興味ある体験を探すことができる～
                    </div>
                    <div className="flex justify-end mt-10 space-x-4">
                        <CTAButton link="/auth/register">
                            ゲスト登録する
                        </CTAButton>
                        <CTAButton link="/services">詳しく見る</CTAButton>
                    </div>
                </div>
            </div>
            <div className="relative h-56 sm:h-72 md:absolute md:right-0 md:top-0 md:h-full md:w-1/2">
                <img
                    src="/cta-bg1.jpg"
                    className="object-cover w-full h-full"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b md:bg-gradient-to-r from-primary to-green-transparent"></div>
            </div>
        </div>
    );
};
