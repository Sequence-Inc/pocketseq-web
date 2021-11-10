import React from "react";
import Head from "next/head";
import Link from "next/link";

const Teaser = () => {
    return (
        <>
            <Head>
                <title>time book</title>
            </Head>
            <div className="w-full h-screen overflow-hidden bg-primary">
                <div className="relative py-16">
                    <div
                        className="absolute inset-x-0 top-0 hidden h-1/2 lg:block"
                        aria-hidden="true"
                    />
                    <div className="mx-auto max-w-7xl lg:px-8">
                        <div className="">
                            <div className="relative bg-primary lg:items-center">
                                <div
                                    className="absolute inset-0 hidden overflow-hidden rounded-3xl lg:block"
                                    aria-hidden="true"
                                >
                                    <svg
                                        className="absolute transform bottom-full left-full translate-y-1/3 -translate-x-2/3 xl:bottom-auto xl:top-0 xl:translate-y-0"
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
                                        className="absolute transform top-full -translate-y-1/3 -translate-x-1/3 xl:-translate-y-1/2"
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
                                <div className="relative max-w-md px-4 py-12 mx-auto space-y-10 text-center sm:max-w-3xl sm:py-16 sm:px-6 lg:max-w-none lg:p-0">
                                    <h2
                                        className="my-10 text-3xl font-extrabold text-white"
                                        id="join-heading"
                                    >
                                        <img
                                            src="/timebook-logo.svg"
                                            className="w-1/2 mx-auto"
                                        />
                                    </h2>
                                    <div>
                                        <h2 className="text-3xl font-bold text-white">
                                            「人x場所x体験」を繋げる
                                        </h2>
                                        <p className="mt-4 text-2xl text-green-100">
                                            さぁ、思い思いの場所と体験を見つけに行こう！
                                        </p>
                                    </div>
                                    <div>
                                        <Link href="/auth/host-register">
                                            <a className="block w-full px-5 py-3 text-base font-medium text-center bg-white border border-transparent rounded-md shadow-md text-primary hover:bg-gray-50 sm:inline-block sm:w-auto">
                                                施設を掲載する
                                            </a>
                                        </Link>
                                    </div>
                                    <div>
                                        <p className="text-white">
                                            アカウントをお持ちの方
                                            <Link href="/auth/login">
                                                <a className="text-base font-medium text-center text-white border border-transparent rounded-md bg-primary hover:underline sm:inline-block sm:w-auto">
                                                    ログインする
                                                </a>
                                            </Link>
                                        </p>
                                    </div>
                                    <div>
                                        <a
                                            href="/time-book-プレスリリース.pdf"
                                            className="text-white hover:underline"
                                        >
                                            time
                                            bookについてプレスリリースはこちら
                                        </a>
                                    </div>
                                    <p className="pt-10 text-sm text-green-100">
                                        &copy; copyright time book 2021.
                                    </p>
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