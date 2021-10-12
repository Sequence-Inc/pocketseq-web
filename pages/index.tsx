import React from "react";
import Head from "next/head";
import Link from "next/link";

const Teaser = () => {
    return (
        <>
            <Head>
                <title>time book</title>
            </Head>
            <div className="h-screen w-full bg-primary">
                <div className="relative py-16 bg-primary">
                    <div
                        className="hidden absolute top-0 inset-x-0 h-1/2 lg:block"
                        aria-hidden="true"
                    />
                    <div className="max-w-7xl mx-auto bg-primary lg:bg-transparent lg:px-8">
                        <div className="">
                            <div className="relative bg-primary lg:items-center">
                                <div
                                    className="hidden absolute inset-0 overflow-hidden rounded-3xl lg:block"
                                    aria-hidden="true"
                                >
                                    <svg
                                        className="absolute bottom-full left-full transform translate-y-1/3 -translate-x-2/3 xl:bottom-auto xl:top-0 xl:translate-y-0"
                                        width={404}
                                        height={384}
                                        fill="none"
                                        viewBox="0 0 404 384"
                                        aria-hidden="true"
                                    >
                                        <defs>
                                            <pattern
                                                id="64e643ad-2176-4f86-b3d7-f2c5da3b6a6d"
                                                x={0}
                                                y={0}
                                                width={20}
                                                height={20}
                                                patternUnits="userSpaceOnUse"
                                            >
                                                <rect
                                                    x={0}
                                                    y={0}
                                                    width={4}
                                                    height={4}
                                                    className="text-green-500"
                                                    fill="currentColor"
                                                />
                                            </pattern>
                                        </defs>
                                        <rect
                                            width={404}
                                            height={384}
                                            fill="url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)"
                                        />
                                    </svg>
                                    <svg
                                        className="absolute top-full transform -translate-y-1/3 -translate-x-1/3 xl:-translate-y-1/2"
                                        width={404}
                                        height={384}
                                        fill="none"
                                        viewBox="0 0 404 384"
                                        aria-hidden="true"
                                    >
                                        <defs>
                                            <pattern
                                                id="64e643ad-2176-4f86-b3d7-f2c5da3b6a6d"
                                                x={0}
                                                y={0}
                                                width={20}
                                                height={20}
                                                patternUnits="userSpaceOnUse"
                                            >
                                                <rect
                                                    x={0}
                                                    y={0}
                                                    width={4}
                                                    height={4}
                                                    className="text-green-500"
                                                    fill="currentColor"
                                                />
                                            </pattern>
                                        </defs>
                                        <rect
                                            width={404}
                                            height={384}
                                            fill="url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)"
                                        />
                                    </svg>
                                </div>
                                <div className="relative max-w-md mx-auto py-12 px-4 space-y-6 sm:max-w-3xl sm:py-16 sm:px-6 lg:max-w-none lg:p-0 text-center">
                                    <h2
                                        className="text-3xl font-extrabold text-white my-10"
                                        id="join-heading"
                                    >
                                        <img
                                            src="/timebook-logo.svg"
                                            className="w-1/2 mx-auto"
                                        />
                                    </h2>
                                    <Link href="/auth/host-register">
                                        <a className="block w-full py-3 px-5 text-center bg-white border border-transparent rounded-md shadow-md text-base font-medium text-primary hover:bg-gray-50 sm:inline-block sm:w-auto">
                                            事前登録
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Teaser;
