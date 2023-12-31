import React, { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Tab } from "@headlessui/react";
import {
    CheckCircleIcon,
    HandIcon,
    ShieldExclamationIcon,
    ShoppingBagIcon,
} from "@heroicons/react/outline";
import { Container } from "@element";
import { Header, Footer } from "@layout";

import { getSession, signIn, useSession } from "next-auth/react";
import { config, FormatPrice, PriceFormatter } from "src/utils/index";
import createApolloClient from "src/apollo/apolloClient";
import { ALL_SUBSCRIPTION_PRODUCTS } from "src/apollo/queries/subscriptions/queries";
import { LoadingSpinner, SubscriptionItemsList } from "@comp";
import {
    SubscriptionCategoryType,
    SubscriptionProduct,
} from "src/apollo/queries/subscriptions/core.schema";
import { useFetchPaymentSources } from "@hooks/paymentSource";
import AlertModal from "src/components/AlertModal";
import { useRouter } from "next/router";
import { useCreateSubscriptions } from "@hooks/subscriptions";
import { CheckIcon, CogIcon, ExclamationIcon } from "@heroicons/react/solid";

export default function Home({ userSession, allSubscriptionProducts }) {
    const [currentSpaceCategory, setCurrentSpaceCategory] =
        useState<SubscriptionCategoryType>("A");
    const [currentHotelCategory, setCurrentHotelCategory] =
        useState<SubscriptionCategoryType>("A");
    const [spaceProducts, setSpaceProducts] =
        useState<SubscriptionProduct[]>(null);
    const [hotelProducts, setHotelProducts] =
        useState<SubscriptionProduct[]>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const [selectedPriceId, setSelectedPriceId] = useState<string>();
    const {
        creatingSubscription,
        subscriptionSuccessful,
        subscriptionFailed,
        onSubmit,
        resetSubscription,
    } = useCreateSubscriptions({});

    useEffect(() => {
        if (!modalOpen) {
            setSelectedPriceId(null);
        }
    }, [modalOpen]);

    const router = useRouter();
    const redirectAuth = () => signIn();
    const redirectPaymentSource = () => router.push("/user/settings");
    const redirectManageSubscription = () => router.push("/user/subscriptions");
    const redirectSignup = () => router.push("/auth/register");
    const { paymentSource, paymentSourcefetchError, loadingPaymentSources } =
        useFetchPaymentSources();

    const defaultPaymentSource = useMemo(() => {
        if (paymentSource?.length) {
            return paymentSource.find((src) => !!src.isDefault);
        }
    }, [paymentSource]);

    const handleSubscribe = useCallback(() => {
        onSubmit(selectedPriceId);
    }, [selectedPriceId]);

    const modalContent = useMemo(() => {
        if (!userSession) {
            return (
                <div>
                    <div className="flex items-center justify-center space-x-2">
                        <div className="text-red-400  p-1 border-2 rounded-full border-red-400">
                            <ShieldExclamationIcon className="w-6 h-6" />
                        </div>
                        <div className=" text-base font-semibold  text-red-500">
                            ログインが必要です
                        </div>
                    </div>
                    <div className=" mt-4 text-center  space-y-4">
                        <div className="text-sm text-gray-600">
                            ログイン又はアカウントを登録して下さい
                        </div>

                        <div className="flex flex-col w-full justify-between  space-y-4 ">
                            <button
                                type="button"
                                className="relative w-1/2 mt-3 text-base  bg-secondary border border-gray-200 rounded-md shadow-sm py-2 font-bold text-gray-600 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-gray-600 focus:z-10 sm:w-auto sm:px-8"
                                onClick={redirectAuth}
                            >
                                ログイン
                            </button>

                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={redirectSignup}
                            >
                                サインアップ
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        if (loadingPaymentSources) {
            return (
                <div className="">
                    <div className="flex items-center justify-center space-x-2">
                        <LoadingSpinner />
                    </div>
                </div>
            );
        }

        if (paymentSourcefetchError) {
            return (
                <div>
                    <div className="flex items-center justify-center space-x-2">
                        <div className="text-red-400  p-1 border-2 rounded-full border-red-400">
                            <HandIcon className="w-6 h-6" />
                        </div>
                        <div className=" text-base font-semibold  text-red-500">
                            エラーが発生しました
                        </div>
                    </div>
                    <div className=" mt-4 text-center space-y-4">
                        <div className="text-sm text-gray-600">
                            お支払い方法を読み込めませんでした。
                            後でもう一度やり直してください。
                        </div>

                        <button
                            type="button"
                            className="relative w-1/2 mt-3 text-base  bg-secondary border border-gray-200 rounded-md shadow-sm py-2 font-bold text-gray-600 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-gray-600 focus:z-10 sm:w-auto sm:px-8"
                            onClick={() => setModalOpen(false)}
                        >
                            閉じる
                        </button>
                    </div>
                </div>
            );
        }

        if (!defaultPaymentSource) {
            return (
                <div>
                    <div className="flex items-center justify-center space-x-2">
                        <div className="text-red-400  p-1 border-2 rounded-full border-red-400">
                            <HandIcon className="w-6 h-6" />
                        </div>
                        <div className=" text-base font-semibold  text-red-500">
                            エラーが発生しました
                        </div>
                    </div>
                    <div className=" mt-4 text-center space-y-4">
                        <div className="text-sm text-gray-600">
                            既存の支払い方法が見つかりません。最初の設定画面で支払い方法を追加してください。
                        </div>

                        <button
                            type="button"
                            className="relative w-1/2 mt-3 text-base bg-secondary border border-gray-200 rounded-md shadow-sm py-2 font-bold text-gray-600 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-gray-600 focus:z-10 sm:w-auto sm:px-8"
                            onClick={redirectPaymentSource}
                        >
                            設定へ
                        </button>
                    </div>
                </div>
            );
        }

        if (!!subscriptionSuccessful) {
            return (
                <div className="">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="text-green-600  p-1 border-2 rounded-full border-green-600">
                            <CheckIcon className="w-6 h-6" />
                        </div>
                        <div className=" text-base font-semibold text-green-700">
                            成功しました
                        </div>
                    </div>
                    <div className=" mt-4 text-center space-y-4">
                        <div className="text-sm text-gray-600">
                            サブスクリプションが成功しました
                        </div>

                        <button
                            type="button"
                            className="relative w-1/2 mt-3 text-base  bg-primary rounded-md shadow-sm py-2 font-bold text-white whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:z-10 sm:w-auto sm:px-8"
                            onClick={() => {
                                setModalOpen(false);
                                resetSubscription();
                            }}
                        >
                            終わり
                        </button>
                    </div>
                </div>
            );
        }

        if (creatingSubscription) {
            return (
                <div className="">
                    <div className="flex items-center justify-center space-x-2">
                        <LoadingSpinner loadingText="購買中..." />
                    </div>
                </div>
            );
        }

        if (!!subscriptionFailed) {
            return (
                <div className="">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="text-red-400  p-1 border-2 rounded-full border-red-400">
                            <ExclamationIcon className="w-6 h-6" />
                        </div>
                        <div className=" text-base font-semibold  text-red-500">
                            既に登録済みです
                        </div>
                    </div>
                    <div className=" mt-4 text-center space-y-4">
                        {subscriptionFailed?.message ===
                        "You have already subscribed to rental-space subscription" ? (
                            <>
                                <div className="text-sm text-gray-600">
                                    このサブスクリプションに既に登録されています
                                </div>
                                <div className="flex flex-col space-y-4">
                                    <button
                                        className="bg-primary p-3 rounded-md text-sm text-white"
                                        onClick={() => {
                                            redirectManageSubscription();
                                            resetSubscription();
                                        }}
                                    >
                                        サブスクリプションを管理
                                    </button>

                                    <button
                                        onClick={() => {
                                            setModalOpen(false);
                                            resetSubscription();
                                        }}
                                    >
                                        キャンセル
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-sm text-gray-600">
                                    サブスクリプションに失敗しました。
                                    もう一度お試しください。
                                </div>

                                <button
                                    type="button"
                                    className="relative w-1/2 mt-3 text-base  bg-primary rounded-md shadow-sm py-2 font-bold text-white whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:z-10 sm:w-auto sm:px-8"
                                    onClick={() => {
                                        setModalOpen(false);
                                        resetSubscription();
                                    }}
                                >
                                    確認
                                </button>
                            </>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="">
                <div className="flex items-center justify-center space-x-2">
                    <div className="text-green-600  p-1 border-2 rounded-full border-green-600">
                        <ShoppingBagIcon className="w-6 h-6" />
                    </div>
                    <div className=" text-base font-semibold text-green-700">
                        サブスクリプション
                    </div>
                </div>
                <div className=" mt-4 text-center space-y-4">
                    <div className="text-sm text-gray-600">
                        購買を希望しますか？
                    </div>

                    <button
                        type="button"
                        className="relative w-1/2 mt-3 text-base  bg-primary rounded-md shadow-sm py-2 font-bold text-white whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:z-10 sm:w-auto sm:px-8"
                        onClick={handleSubscribe}
                    >
                        確認
                    </button>
                </div>
            </div>
        );
    }, [
        useSession,
        defaultPaymentSource,
        subscriptionSuccessful,
        subscriptionFailed,
        creatingSubscription,
        loadingPaymentSources,
        paymentSourcefetchError,
        resetSubscription,
        handleSubscribe,
    ]);

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
        setModalOpen(true);
        setSelectedPriceId(priceId);
    };

    console.log(spaceProducts, hotelProducts);

    if (!spaceProducts || !hotelProducts) {
        return (
            <div className="my-20">
                <LoadingSpinner />
            </div>
        );
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
                    isOpen={modalOpen}
                    setOpen={() => {
                        setModalOpen(false);
                        resetSubscription();
                    }}
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
                                            スペース・サブスクリプション・プラン
                                        </h1>
                                        <div className="mt-5 text-xl text-gray-500 sm:text-center">
                                            スペースを定額制でご利用いただけます。アカウントプランでは、さらに多くの機能を利用できます。
                                        </div>
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
                                                カテゴリーA
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
                                                カテゴリーB
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
                                                カテゴリーC
                                            </button>
                                        </div>
                                        <div className="mt-8">
                                            <SubscriptionItemsList
                                                type="space"
                                                category={currentSpaceCategory}
                                                numbers={4}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6 space-y-4 sm:mt-6 sm:space-y-0 sm:grid sm:grid-cols-1 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
                                        {spaceProducts.map((product) => (
                                            <div
                                                key={product.name}
                                                className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200"
                                            >
                                                <div className="p-6 text-center">
                                                    <h2 className="text-lg leading-6 font-bold text-gray-900">
                                                        {product.name}
                                                    </h2>
                                                    <div className="mt-4 text-gray-500">
                                                        毎月{product.unit}
                                                        時間を使う
                                                    </div>
                                                    <div className="mt-8">
                                                        <span className="text-4xl tracking-tight font-bold text-gray-900">
                                                            {PriceFormatter(
                                                                product.price
                                                                    .amount
                                                            )}
                                                        </span>{" "}
                                                        <span className="text-base font-bold text-gray-500">
                                                            /月
                                                        </span>
                                                    </div>
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
                                            ホテル・サブスクリプション・プラン
                                        </h1>
                                        <div className="mt-5 text-xl text-gray-500 sm:text-center">
                                            スペースを定額制でご利用いただけます。アカウントプランでは、さらに多くの機能を利用できます。
                                        </div>
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
                                                カテゴリーA
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
                                                カテゴリーB
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
                                                カテゴリーC
                                            </button>
                                        </div>
                                        <div className="mt-8">
                                            <SubscriptionItemsList
                                                type="hotel"
                                                category={currentHotelCategory}
                                                numbers={4}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6 space-y-4 sm:mt-6 sm:space-y-0 sm:grid sm:grid-cols-1 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
                                        {hotelProducts.map((product) => (
                                            <div
                                                key={product.name}
                                                className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200"
                                            >
                                                <div className="p-6 text-center">
                                                    <h2 className="text-lg leading-6 font-bold text-gray-900">
                                                        {product.name}
                                                    </h2>
                                                    <div className="mt-4 text-gray-500">
                                                        毎月{product.unit}
                                                        時間を使う
                                                    </div>
                                                    <div className="mt-8">
                                                        <span className="text-4xl tracking-tight font-bold text-gray-900">
                                                            {PriceFormatter(
                                                                product.price
                                                                    .amount
                                                            )}
                                                        </span>{" "}
                                                        <span className="text-base font-bold text-gray-500">
                                                            /月
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => {
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
