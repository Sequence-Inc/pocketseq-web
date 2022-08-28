import React, { useEffect, useState } from "react";
import Head from "next/head";

import { Container } from "@element";
import { Header, Footer } from "@layout";

import { getSession } from "next-auth/react";
import { config, PriceFormatter } from "src/utils/index";
import createApolloClient from "src/apollo/apolloClient";
import { ALL_SUBSCRIPTION_PRODUCTS } from "src/apollo/queries/subscriptions/queries";
import { LoadingSpinner } from "@comp";
import {
    SubscriptionCategoryType,
    SubscriptionProduct,
} from "src/apollo/queries/subscriptions/core.schema";

const tiers = [
    {
        name: "Lite",
        href: "#",
        priceMonthly: 12,
        description: "All the basics for starting a new business",
        includedFeatures: [
            "Potenti felis, in cras at at ligula nunc.",
            "Orci neque eget pellentesque.",
        ],
    },
    {
        name: "Standard",
        href: "#",
        priceMonthly: 24,
        description: "All the basics for starting a new business",
        includedFeatures: [
            "Potenti felis, in cras at at ligula nunc. ",
            "Orci neque eget pellentesque.",
            "Donec mauris sit in eu tincidunt etiam.",
        ],
    },
    {
        name: "Premium",
        href: "#",
        priceMonthly: 32,
        description: "All the basics for starting a new business",
        includedFeatures: [
            "Potenti felis, in cras at at ligula nunc. ",
            "Orci neque eget pellentesque.",
            "Donec mauris sit in eu tincidunt etiam.",
            "Faucibus volutpat magna.",
        ],
    },
];

export default function Home({ userSession, allSubscriptionProducts }) {
    const [currentSpaceCategory, setCurrentSpaceCategory] =
        useState<SubscriptionCategoryType>("A");
    const [currentHotelCategory, setCurrentHotelCategory] =
        useState<SubscriptionCategoryType>("A");
    const [spaceProducts, setSpaceProducts] =
        useState<SubscriptionProduct[]>(null);
    const [hotelProducts, setHotelProducts] =
        useState<SubscriptionProduct[]>(null);

    useEffect(() => {
        const typeSpace: SubscriptionProduct[] = [];
        const typeHotel: SubscriptionProduct[] = [];
        allSubscriptionProducts.map((product: SubscriptionProduct) => {
            if (product.type === "rental-space") {
                typeSpace.push(product);
            } else {
                typeHotel.push(product);
            }

            // sort products
            const sortedSpaceProducts: SubscriptionProduct[] = typeSpace.sort(
                (a, b) => parseInt(a.unit, 10) - parseInt(b.unit, 10)
            );
            const sortedHotelProducts: SubscriptionProduct[] = typeHotel.sort(
                (a, b) => parseInt(a.unit, 10) - parseInt(b.unit, 10)
            );
            const filteredSpaceProducts = sortedSpaceProducts.map((product) => {
                return {
                    ...product,
                    price: product.prices.filter(
                        (price) => price.name === currentSpaceCategory
                    )[0],
                };
            });
            const filteredHotelProducts = sortedHotelProducts.map((product) => {
                return {
                    ...product,
                    price: product.prices.filter(
                        (price) => price.name === currentHotelCategory
                    )[0],
                };
            });
            setSpaceProducts(filteredSpaceProducts);
            setHotelProducts(filteredHotelProducts);
        });
    }, [currentSpaceCategory, currentHotelCategory]);

    if (!spaceProducts || !hotelProducts) {
        return <LoadingSpinner />;
    }

    const tabButtonClass = (a, b) => {
        return a === b
            ? `relative w-1/2 bg-white border border-gray-200 rounded-md shadow-sm py-2 text-sm font-bold text-gray-900 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:z-10 sm:w-auto sm:px-8`
            : `relative w-1/2 border border-transparent rounded-md py-2 text-sm font-bold text-gray-700 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:z-10 sm:w-auto sm:px-8`;
    };

    return (
        <div className="bg-gray-50">
            <Head>
                <title>{config.appName} | サブスクリプション</title>
                <meta
                    name="description"
                    content={`${config.appName} サブスクリプション | タイムブックは、会議やPartyの場所を探している人、顧客や技術はあるが提供する場所がない人、そんな人たちのやりたい事場所が全部見つかる`}
                />
                <meta
                    name="keywords"
                    content={`${config.appName},タイムブック,レンタルスペース, ペット可`}
                />
                <meta
                    property="og:title"
                    content={`${config.appName} | 「人×場所×体験」を繋げる 目的に合った場所を検索しよう`}
                />
                <meta
                    property="og:description"
                    content={`${config.appName} タイムブックは、会議やPartyの場所を探している人、顧客や技術はあるが提供する場所がない人、そんな人たちのやりたい事場所が全部見つかる`}
                />
                {/* <meta
                    property="og:image"
                    content="OGP用の紹介画像のパスを指定してください"
                /> */}
            </Head>
            <Header userSession={userSession} />
            <main>
                <Container className="py-12 space-y-12 md:py-20 md:space-y-20">
                    <div className="relative">
                        <div className="bg-white rounded-lg">
                            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                                <div>
                                    <div className="sm:flex sm:flex-col sm:align-center">
                                        <h1 className="text-5xl tracking-tight font-bold text-primary sm:text-center">
                                            Space Subscription Plans
                                        </h1>
                                        <p className="mt-5 text-xl text-gray-500 sm:text-center">
                                            Start building for free, then add a
                                            site plan to go live. Account plans
                                            unlock additional features.
                                        </p>
                                        <div className="relative self-center mt-6 bg-gray-100 rounded-lg p-0.5 flex sm:mt-8">
                                            <button
                                                type="button"
                                                className={tabButtonClass(
                                                    currentSpaceCategory,
                                                    "A"
                                                )}
                                                onClick={() => {
                                                    setCurrentSpaceCategory(
                                                        "A"
                                                    );
                                                }}
                                            >
                                                Category A
                                            </button>
                                            <button
                                                type="button"
                                                className={tabButtonClass(
                                                    currentSpaceCategory,
                                                    "B"
                                                )}
                                                onClick={() => {
                                                    setCurrentSpaceCategory(
                                                        "B"
                                                    );
                                                }}
                                            >
                                                Category B
                                            </button>
                                            <button
                                                type="button"
                                                className={tabButtonClass(
                                                    currentSpaceCategory,
                                                    "C"
                                                )}
                                                onClick={() => {
                                                    setCurrentSpaceCategory(
                                                        "C"
                                                    );
                                                }}
                                            >
                                                Category C
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-1 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
                                        {spaceProducts.map((product) => (
                                            <div
                                                key={product.name}
                                                className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200"
                                            >
                                                <div className="p-6 text-center">
                                                    <h2 className="text-lg leading-6 font-bold text-gray-900">
                                                        {product.name}
                                                    </h2>
                                                    <p className="mt-4 text-gray-500">
                                                        毎月
                                                        <span className="text-gray-700">
                                                            {product.unit}
                                                            時間
                                                        </span>
                                                        を使う
                                                    </p>
                                                    <p className="mt-8">
                                                        <span className="text-4xl tracking-tight font-bold text-gray-900">
                                                            {PriceFormatter(
                                                                product.price
                                                                    .amount
                                                            )}
                                                        </span>{" "}
                                                        <span className="text-base font-bold text-gray-500">
                                                            /月
                                                        </span>
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            console.log(
                                                                "Subscript to price id",
                                                                product.price.id
                                                            );
                                                        }}
                                                        className="mt-8 block w-full bg-primary border border-primary rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-primaryHover"
                                                    >
                                                        {product.name}を買う
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="bg-white rounded-lg">
                            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                                <div>
                                    <div className="sm:flex sm:flex-col sm:align-center">
                                        <h1 className="text-5xl tracking-tight font-bold text-primary sm:text-center">
                                            Hotel Subscription Plans
                                        </h1>
                                        <p className="mt-5 text-xl text-gray-500 sm:text-center">
                                            Start building for free, then add a
                                            site plan to go live. Account plans
                                            unlock additional features.
                                        </p>
                                        <div className="relative self-center mt-6 bg-gray-100 rounded-lg p-0.5 flex sm:mt-8">
                                            <button
                                                type="button"
                                                className={tabButtonClass(
                                                    currentHotelCategory,
                                                    "A"
                                                )}
                                                onClick={() => {
                                                    setCurrentHotelCategory(
                                                        "A"
                                                    );
                                                }}
                                            >
                                                Category A
                                            </button>
                                            <button
                                                type="button"
                                                className={tabButtonClass(
                                                    currentHotelCategory,
                                                    "B"
                                                )}
                                                onClick={() => {
                                                    setCurrentHotelCategory(
                                                        "B"
                                                    );
                                                }}
                                            >
                                                Category B
                                            </button>
                                            <button
                                                type="button"
                                                className={tabButtonClass(
                                                    currentHotelCategory,
                                                    "C"
                                                )}
                                                onClick={() => {
                                                    setCurrentHotelCategory(
                                                        "C"
                                                    );
                                                }}
                                            >
                                                Category C
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-1 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
                                        {hotelProducts.map((product) => (
                                            <div
                                                key={product.name}
                                                className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200"
                                            >
                                                <div className="p-6 text-center">
                                                    <h2 className="text-lg leading-6 font-bold text-gray-900">
                                                        {product.name}
                                                    </h2>
                                                    <p className="mt-4 text-gray-500">
                                                        毎月
                                                        <span className="text-gray-700">
                                                            {product.unit}泊
                                                        </span>
                                                        を使う
                                                    </p>
                                                    <p className="mt-8">
                                                        <span className="text-4xl tracking-tight font-bold text-gray-900">
                                                            {PriceFormatter(
                                                                product.price
                                                                    .amount
                                                            )}
                                                        </span>{" "}
                                                        <span className="text-base font-bold text-gray-500">
                                                            /月
                                                        </span>
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            console.log(
                                                                "Subscribe to price id",
                                                                product.price.id
                                                            );
                                                        }}
                                                        className="mt-8 block w-full bg-primary border border-primary rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-primaryHover"
                                                    >
                                                        {product.name}を買う
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}

export const getServerSideProps = async (context) => {
    const client = createApolloClient();
    const { data } = await client.query({
        query: ALL_SUBSCRIPTION_PRODUCTS,
    });
    const session = await getSession(context);
    return {
        props: {
            userSession: session,
            allSubscriptionProducts: data.allSubscriptionProducts,
        },
    };
};
