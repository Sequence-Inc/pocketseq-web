import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Tab } from "@headlessui/react";
import {
    HandIcon,
    ShieldExclamationIcon,
    ShoppingBagIcon,
} from "@heroicons/react/outline";
import { Container } from "@element";
import { Header, Footer } from "@layout";

import { getSession, useSession } from "next-auth/react";
import { config, FormatPrice, PriceFormatter } from "src/utils/index";
import createApolloClient from "src/apollo/apolloClient";
import { ALL_SUBSCRIPTION_PRODUCTS } from "src/apollo/queries/subscriptions/queries";
import { LoadingSpinner } from "@comp";
import {
    SubscriptionCategoryType,
    SubscriptionProduct,
} from "src/apollo/queries/subscriptions/core.schema";
import { useFetchPaymentSources } from "@hooks/paymentSource";
import AlertModal from "src/components/AlertModal";
import { useRouter } from "next/router";

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

    const router = useRouter();
    const redirectAuth = () => router.push("/auth/login");
    const redirectPaymentSource = () => router.push("/user/settings");

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const { paymentSource, paymentSourcefetchError, loadingPaymentSources } =
        useFetchPaymentSources();

    const defaultPaymentSource = useMemo(() => {
        if (paymentSource?.length) {
            return paymentSource.find((src) => !!src.isDefault);
        }
    }, [paymentSource]);

    const modalContent = useMemo(() => {
        if (!userSession) {
            return (
                <div>
                    <div className="flex items-center justify-center space-x-2">
                        <ShieldExclamationIcon className="text-red-600 p-1 text-opacity-70 h-12 border-2 rounded-full border-red-500" />
                        <p className=" text-base font-semibold  text-gray-600">
                            Please wait !
                        </p>
                    </div>
                    <div className=" mt-4 text-center  space-y-4">
                        <p className="text-sm">
                            This action requires you to log in first.
                        </p>

                        <button
                            type="button"
                            className="relative w-1/2 mt-3 text-base  bg-secondary border border-gray-200 rounded-md shadow-sm py-2 font-bold text-gray-800 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-gray-900 focus:z-10 sm:w-auto sm:px-8"
                            onClick={redirectAuth}
                        >
                            Login
                        </button>
                    </div>
                </div>
            );
        }

        if (!defaultPaymentSource) {
            return (
                <div>
                    <div className="flex items-center justify-center space-x-2">
                        <HandIcon className="text-red-600 p-1 text-opacity-70 h-12 border-2 rounded-full border-red-500" />
                        <p className=" text-base font-semibold  text-gray-600">
                            Oops !
                        </p>
                    </div>
                    <div className=" mt-4 text-center  space-y-4">
                        <p className="text-sm">
                            Default Payment source not found. Please add default
                            payment source first in your settings page.
                        </p>

                        <button
                            type="button"
                            className="relative w-1/2 mt-3 text-base  bg-secondary border border-gray-200 rounded-md shadow-sm py-2 font-bold text-gray-800 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-gray-900 focus:z-10 sm:w-auto sm:px-8"
                            onClick={redirectPaymentSource}
                        >
                            Go to Settings
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="">
                <div className="flex items-center justify-center space-x-2">
                    <ShoppingBagIcon className="text-blue-600 p-1 text-opacity-70 h-12 border-2 rounded-full border-blue-500" />
                    <p className=" text-base font-semibold  text-gray-600">
                        Subscribe
                    </p>
                </div>
                <div className=" mt-4 text-center space-y-4">
                    <p className="text-sm">
                        Are your sure you want to subscribe ?
                    </p>

                    <button
                        type="button"
                        className="relative w-1/2 mt-3 text-base  bg-primary border border-gray-200 rounded-md shadow-sm py-2 font-bold text-white whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary-900 focus:z-10 sm:w-auto sm:px-8"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        );
    }, [useSession, defaultPaymentSource]);

    console.log({
        userSession,
        paymentSource,
        paymentSourcefetchError,
        loadingPaymentSources,
        defaultPaymentSource,
    });

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

    const initiateSpaceSubscription = (priceId) => {
        console.log({ priceId });
    };

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
                <AlertModal
                    isOpen={true}
                    disableTitle
                    disableDefaultIcon
                    // title="Subscription Process"
                    // iconClass="h-6 w-6 text-green-600"
                >
                    {modalContent}
                </AlertModal>
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
                                                        毎月{product.unit}
                                                        時間を使う
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
                                                            initiateSpaceSubscription(
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
                                                        毎月{product.unit}
                                                        時間を使う
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
