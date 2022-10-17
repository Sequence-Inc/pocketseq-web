import React from "react";
import Head from "next/head";
import Link from "next/link";

import {
    BookmarkAltIcon,
    FireIcon,
    ShieldCheckIcon,
} from "@heroicons/react/outline";

import { ICategoryItem, IExploreItem } from "@comp";
import { config } from "src/utils/index";

const Teaser = () => {
    return (
        <>
            <Head>
                <title>
                    {config.appName} ({config.appNameEnglish})
                </title>
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
                                            src="/pocketseq-logo.svg"
                                            className="w-1/2 mx-auto"
                                        />
                                    </h2>
                                    <div>
                                        <h2 className="text-5xl font-bold text-white">
                                            「人×場所×体験」を繋げる
                                        </h2>
                                        <p className="mt-4 text-2xl text-green-100">
                                            さぁ、思い思いの場所と体験を見つけに行こう！
                                        </p>
                                    </div>
                                    <div>
                                        <Link href="/auth/host-register">
                                            <a className="block w-full px-5 py-3 text-base font-medium text-center bg-white border border-transparent rounded-md shadow-md text-primary hover:text-primaryHover hover:bg-gray-50 sm:inline-block sm:w-auto">
                                                施設を掲載する
                                            </a>
                                        </Link>
                                    </div>
                                    <div>
                                        <p className="text-white">
                                            アカウントをお持ちの方
                                            <Link href="/auth/login">
                                                <a className="text-base font-medium text-center text-white hover:text-green-50 border border-transparent rounded-md bg-primary hover:underline sm:inline-block sm:w-auto">
                                                    ログインする
                                                </a>
                                            </Link>
                                        </p>
                                    </div>
                                    <div>
                                        <a
                                            href="https://prtimes.jp/main/html/rd/p/000000002.000089436.html"
                                            target="_blank"
                                            className="text-white hover:text-green-50 hover:underline"
                                        >
                                            {config.appName}
                                            についてプレスリリースはこちら
                                        </a>
                                    </div>
                                    <p className="pt-10 text-sm text-green-100">
                                        &copy; copyright {config.appName} 2022.
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

export const itemGridData = [
    {
        id: 1,
        photo: "https://cdnspacemarket.com/uploads/attachments/445622/image.jpg?fit=crop&width=1200&height=800&bg-color=9c9c9c",
        location: "東京都渋谷区",
        rating: 4.1,
        cases: 328,
        title: "108【シェアスペORENGE新宿】🎇スパークリング割🎇定期消毒✨テレワーク✨新宿駅3分✨最大12名✨会議✨パーティ",
        price: 1131,
        people: 12,
        area: "32m²",
        tag: "おうちスペース",
        coords: {
            lat: 35.662,
            lng: 139.7038,
        },
    },
    {
        id: 2,
        photo: "https://cdnspacemarket.com/uploads/attachments/315502/image.jpg?fit=crop&width=1200&height=800&bg-color=9c9c9c",
        location: "東京都新宿区",
        rating: 4.6,
        cases: 415,
        title: "013_fika新宿御苑🌿夏割🌊最大24名収容⭕新宿三丁目3分＆新宿御苑駅3分🚶‍♂️65型TV📺本格キッチン🍴Wi-Fi📶",
        price: 1732,
        people: 30,
        area: "60m²",
        tag: "イベントスペース",
        coords: {
            lat: 35.663,
            lng: 139.705,
        },
    },
    {
        id: 3,
        photo: "https://cdnspacemarket.com/uploads/attachments/693445/image.jpg?fit=crop&width=1200&height=800&bg-color=9c9c9c",
        location: "東京都渋谷区",
        rating: 4.2,
        cases: 13,
        title: "夏割⛵定期除菌🌟新宿駅徒歩３分【ティファニー会議室】清潔素敵空間🌈撮影OK📸会議/セミナー/女子会",
        price: 1732,
        people: 6,
        area: "19m²",
        tag: "貸し会議室",
        coords: {
            lat: 35.653,
            lng: 139.7123,
        },
    },
    {
        id: 4,
        photo: "https://cdnspacemarket.com/uploads/attachments/776274/image.jpg?fit=crop&width=1200&height=800&bg-color=9c9c9c",
        location: "東京都新宿区",
        rating: 4.7,
        cases: 123,
        title: "mysa新宿4th🌿夏割🌊🉐新宿5分WiFiでか📺広々ソファ🛋️大人気ゲーム機🎮ネトフリ/女子会/パーティ/撮影/おうちデート",
        price: 623,
        people: 6,
        area: "30m²",
        tag: "おうちスペース",
        coords: {
            lat: 35.6666,
            lng: 139.704,
        },
    },
];
