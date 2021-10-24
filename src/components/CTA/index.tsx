import React from "react";
import Link from "next/link";
import Image from "next/image";

export const CTAButton = ({
    link,
    children,
}: {
    link: string;
    children: string;
}) => {
    return (
        <Link href={link}>
            <a className="inline-flex items-center justify-center px-5 py-2 text-base font-medium text-white hover:text-gray-600 bg-[#007A74] border border-transparent rounded-md shadow hover:bg-gray-50">
                {children}
            </a>
        </Link>
    );
};

export const CTA = ({ title, children }) => {
    return (
        <div className="relative overflow-hidden bg-primary rounded-2xl">
            <div className="relative px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-20">
                <div className="md:px-10">
                    <p className="mt-2 text-center text-3xl font-bold tracking-tight text-white">
                        {title}
                    </p>
                    {children}
                </div>
            </div>
        </div>
    );
};
