import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Container, Tag } from "@element";
import {
    CategoryItem,
    RegisterCTA,
    HeroSection,
    SubscriptionCTA,
    SearchResult,
    LoadingSpinner,
} from "@comp";
import { Header, Footer } from "@layout";

import {
    FlagIcon,
    StarIcon,
    ChevronRightIcon,
    BookmarkAltIcon,
    FireIcon,
    ShieldCheckIcon,
} from "@heroicons/react/outline";
import { GET_AVAILABLE_SPACE_TYPES } from "src/apollo/queries/space.queries";
import { getSession, useSession } from "next-auth/react";
import { config, getFrontPageData, prepareSearchResult } from "src/utils/index";
import createApolloClient from "src/apollo/apolloClient";
import { ItemGridSpace } from "src/components/ItemGridSpace";
import { useQuery } from "@apollo/client";

const features = [
    {
        name: "Secure",
        icon: ShieldCheckIcon,
        description: `${config.appName}はゲスト・ホストを含めすべてのユーザー様の個人情報保護の重要性を認識したうえで個人情報保護法を遵守いたします。`,
    },
    {
        name: "Save Spaces",
        icon: BookmarkAltIcon,
        description:
            "より多くのゲストがご利用できるようより多くのスペースを確保してまいります。",
    },
    {
        name: "Popular",
        icon: FireIcon,
        description:
            "ホストの皆様の大切なスペースを「こだわり」を持ったユーザーの皆様へご提供できるようそして、より多くのユーザーの皆様が繰り返しご利用いただけるよう営業してまいります。",
    },
];

export default function Home({
    newSpaces,
    newHotels,
}: {
    newSpaces: SearchResult[];
    newHotels: SearchResult[];
}) {
    const [session, setSession] = useState(null);

    const { data: sessionData, status } = useSession();

    const {
        data: spaceData,
        loading,
        error,
    } = useQuery(GET_AVAILABLE_SPACE_TYPES);

    useEffect(() => {
        if (status === "authenticated") {
            setSession(sessionData);
        }
    }, [sessionData, status]);

    const spaceTypesData = () => {
        if (loading) {
            return (
                <div>
                    <LoadingSpinner style="my-20" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="my-20 text-gray-600 text-center text-base">
                    データを読み込めませんでした。
                </div>
            );
        }

        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-3 md:gap-x-6 md:gap-y-6">
                {spaceData.availableSpaceTypes?.map((spaceType) => (
                    <CategoryItem
                        key={spaceType.id}
                        title={spaceType.title}
                        subTitle={spaceType.description}
                        photo={spaceType.photo?.medium?.url}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-gray-50">
            <Head>
                <title>
                    {config.appName} ({config.appNameEnglish}) |
                    「人×場所×体験」を繋げる 目的に合った場所を検索しよう
                </title>
                <meta
                    name="description"
                    content={`${config.appName} (${config.appNameEnglish})は、会議やPartyの場所を探している人、顧客や技術はあるが提供する場所がない人、そんな人たちのやりたい事場所が全部見つかる`}
                />
                <meta
                    name="keywords"
                    content={`${config.appName} (${config.appNameEnglish}),レンタルスペース, ペット可`}
                />
                <meta
                    property="og:title"
                    content={`${config.appName} (${config.appNameEnglish}) | 「人×場所×体験」を繋げる 目的に合った場所を検索しよう`}
                />
                <meta
                    property="og:description"
                    content={`${config.appName} (${config.appNameEnglish})は、会議やPartyの場所を探している人、顧客や技術はあるが提供する場所がない人、そんな人たちのやりたい事場所が全部見つかる`}
                />
                {/* <meta
                    property="og:image"
                    content="OGP用の紹介画像のパスを指定してください"
                /> */}
            </Head>
            <Header userSession={session} />
            <main>
                <HeroSection />
                <Container className="py-12 space-y-12 md:py-20 md:space-y-20">
                    {/* Blob */}
                    <div>
                        <div className="relative">
                            <div className="mx-auto text-center">
                                <p className="mt-2 text-2xl tracking-tight text-primary sm:text-3xl">
                                    {config.appName}とは
                                </p>
                                <p className="w-full md:w-2/3 lg:w-1/2 mx-auto mt-6 text-xl font-light text-gray-500">
                                    ホスト様のお持ちの様々なスペースと「こだわり」をもったゲストの皆様をおつなぎいたします。
                                </p>
                                <div className="mt-12">
                                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                                        {features.map((feature) => (
                                            <div
                                                key={feature.name}
                                                className="pt-6"
                                            >
                                                <div className="flow-root px-6 pb-8 bg-white rounded-lg">
                                                    <div className="-mt-6">
                                                        <div>
                                                            <span className="inline-flex items-center justify-center p-3 rounded-md shadow-lg bg-primary">
                                                                <feature.icon
                                                                    className="w-6 h-6 text-white"
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        </div>
                                                        <h3 className="mt-8 text-lg font-medium tracking-tight text-primary">
                                                            {feature.name}
                                                        </h3>
                                                        <p className="mt-5 text-base font-light text-gray-500">
                                                            {
                                                                feature.description
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between px-1 pb-3 mb-6 border-b border-gray-200">
                            <Tag
                                Icon={FlagIcon}
                                iconSize={6}
                                iconStyle="mr-2 text-primary"
                                textStyle="text-xl text-primary"
                            >
                                目的に応じて探す
                            </Tag>
                            <Link href="/search">
                                <a className="flex items-center text-xs text-gray-500 hover:text-primary">
                                    もっと見る
                                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                                </a>
                            </Link>
                        </div>

                        {spaceTypesData()}
                    </div>
                    {/* <div>
                        <div className="flex items-center justify-between px-1 pb-3 mb-6 border-b border-gray-200">
                            <Tag
                                Icon={LocationMarkerIcon}
                                iconSize={6}
                                iconStyle="mr-2 text-primary"
                                textStyle="text-xl text-primary"
                            >
                                近くのエリアから探す
                            </Tag>
                            <Link href="/search">
                                <a className="flex items-center text-xs text-gray-500 hover:text-primary">
                                    もっと見る
                                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                                </a>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:gap-x-6 gap-y-6">
                            {exploreAreas.map((area, index) => (
                                <SingleExploreItem
                                    key={index.toString()}
                                    name={area.name}
                                    distance={area.distance}
                                    photo={area.photo}
                                />
                            ))}
                        </div>
                    </div> */}
                    <div>
                        <div className="flex items-center justify-between px-1 pb-3 mb-6 border-b border-gray-200">
                            <Tag
                                Icon={StarIcon}
                                iconSize={6}
                                iconStyle="mr-2 text-primary"
                                textStyle="text-xl text-primary"
                            >
                                新着スペース
                            </Tag>
                            <Link href="/search?searchType=space">
                                <a className="flex items-center text-xs text-gray-500 hover:text-primary">
                                    もっと見る
                                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                                </a>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-3 md:gap-6 md:grid-cols-4">
                            {newSpaces?.map((item, index) => {
                                return (
                                    <ItemGridSpace key={index} data={item} />
                                );
                            })}
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between px-1 pb-3 mb-6 border-b border-gray-200">
                            <Tag
                                Icon={StarIcon}
                                iconSize={6}
                                iconStyle="mr-2 text-primary"
                                textStyle="text-xl text-primary"
                            >
                                新着宿泊スペース
                            </Tag>
                            <Link href="/search?searchType=hotel">
                                <a className="flex items-center text-xs text-gray-500 hover:text-primary">
                                    もっと見る
                                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                                </a>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
                            {newHotels?.map((item, index) => {
                                return (
                                    <ItemGridSpace key={index} data={item} />
                                );
                            })}
                        </div>
                    </div>
                    <RegisterCTA />
                    <SubscriptionCTA />
                </Container>
            </main>
            <Footer />
        </div>
    );
}

export const getServerSideProps = async (context) => {
    const { space, hotel } = await getFrontPageData();

    const newSpaces = prepareSearchResult("space", space);
    const newHotels = prepareSearchResult("hotel", hotel);
    return {
        props: {
            newSpaces,
            newHotels,
        },
    };
};
