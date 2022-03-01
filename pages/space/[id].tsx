import {
    FloatingPrice,
    HostProfile,
    SpaceUtilities,
    SpaceInfoTitle,
    SpaceInfoBanner,
    SpaceInfoAccess,
    SpaceInfoReviews,
    ISpaceInfoTitleProps,
} from "@comp";
import { Button, Container, Tag } from "@element";
import React from "react";
import { MainLayout } from "@layout";
import { StarIcon, ShieldCheckIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { GET_SPACE_BY_ID } from "src/apollo/queries/space.queries";
import {
    config,
    FormatShortAddress,
    PriceFormatter,
    publicImage,
} from "src/utils";
import { IRating } from "src/types/timebookTypes";
import Head from "next/head";
import { useRouter } from "next/router";

import createApolloClient from "../../src/apollo/apolloClient";
import { getSession } from "next-auth/react";

const ContentSection = ({
    title,
    description,
}: {
    title: string;
    description: string;
}) => {
    return (
        <div>
            <h2 className="mb-4 text-lg font-bold text-gray-700">{title}</h2>
            <div className="mb-4 text-sm text-gray-500">{description}</div>
            <Link href="/">
                <a className="text-gray-600 underline">もっと見る</a>
            </Link>
        </div>
    );
};

const SpaceDetail = ({ spaceId, space, userSession }) => {
    const id = spaceId;
    const router = useRouter();

    const {
        name,
        description,
        maximumCapacity,
        spaceSize,
        spaceTypes,
        spacePricePlans,
        nearestStations,
        address,
        photos,
        host,
    } = space;

    const location: string = FormatShortAddress(address);

    const rating: IRating = { points: 5, reviews: 1 }; // Todo: implement ratings for each spaces

    const titleInfo: ISpaceInfoTitleProps = {
        name,
        maximumCapacity,
        spaceSize,
        spaceTypes,
        location,
        rating,
    };

    const sendMessage = () => {
        if (host)
            router.push(
                `/messages?name=${host?.name}&recipientIds=${host?.accountId}`
            );
    };

    const getPublicPhoto = (photos) => {
        const mediaId = photos[0].id;
        return `https://timebook-public-media.s3.ap-northeast-1.amazonaws.com/small/${mediaId}.jpeg`;
    };

    return (
        <MainLayout userSession={userSession}>
            <Head>
                <title>

                    {name} | 「人 × 場所 × 体験」を繋げる
                    目的に合った場所を検索しよう
                </title>
                <meta
                    name="description"
                    content={`${config.appName} タイムブックは、会議やParty の場所を探している人、顧客や技術はあるが提供する場所がない人、そんな人たちのやりたい事場所が全部
見つかる`}
                />
                <meta
                    name="keywords"
                    content={`${config.appName}, タイムブック, レンタルスペース, ペット可`}
                />
                <meta
                    property="og:title"
                    content={`${name} | 「人 × 場所 × 体験」を繋げる 目的に合った場所を検索しよう`}
                />
                <meta
                    property="og:description"
                    content={`${config.appName} タイムブックは、会議やParty の場所を探している人、顧客や技術はあるが提供する場所がない人、そんな人たちのやりたい事場所が全部見つかる`}
                />
                <meta
                    property="og:image"
                    content={`${publicImage(photos[0], "small")}`}
                />
                <meta
                    name="twitter:title"
                    content={`${name} | 「人 × 場所 × 体験」を繋げる 目的に合った場所を検索しよう`}
                />
                <meta
                    property="twitter:image"
                    content={`${publicImage(photos[0], "small")}`}
                />
            </Head>
            <Container className="mt-16">
                <div className="relative flex space-x-12">
                    <div className="flex-1">
                        <div className="h-6"></div>
                        <SpaceInfoTitle titleInfo={titleInfo} />
                        <SpaceInfoBanner photos={photos} />
                        <div className="w-full my-6 border-t border-gray-300" />
                        <div className="block md:hidden">
                            <FloatingPrice
                                pricePlans={spacePricePlans}
                                space={space}
                            />
                        </div>
                        <div className="w-full my-6 border-t border-gray-300" />
                        <SpaceUtilities />
                        <div className="w-full my-6 border-t border-gray-300" />
                        {/* host profile */}
                        <div>
                            <div className="space-y-6 sm:flex sm:space-y-0">
                                <div className="flex-1">
                                    <HostProfile
                                        title={host?.name}
                                        description="2015年8月年からメンバー"
                                    />
                                </div>
                                <Button
                                    variant="primary"
                                    rounded
                                    className="w-auto px-4 h-9"
                                    onClick={sendMessage}
                                >
                                    Send Message
                                </Button>
                            </div>
                            <div className="flex mt-6 space-x-3">
                                <Tag
                                    Icon={StarIcon}
                                    iconSize={5}
                                    iconStyle="text-red-500"
                                    textStyle="text-sm text-gray-500"
                                    numberOfLines={1}
                                >
                                    499 評価とレビュー
                                </Tag>
                                <Tag
                                    Icon={ShieldCheckIcon}
                                    iconSize={5}
                                    iconStyle="text-red-500"
                                    textStyle="text-sm text-gray-500"
                                    numberOfLines={1}
                                >
                                    本人確認済み
                                </Tag>
                            </div>
                        </div>
                        {/* divider */}
                        <div className="w-full my-6 border-t border-gray-300" />

                        {/* About Sapce */}
                        <ContentSection
                            title="スペースについて"
                            description={description}
                        />

                        {/* divider */}
                        <div className="w-full my-6 border-t border-gray-300" />

                        {/* Services / equipment */}
                        {/* <ContentSection
                            title="サービス・設備"
                            description="ママ会、女子会、おうちデート、映画鑑賞、カップル利用、ファミリー会（子連れ歓迎）、誕生日会、セミナー、ワークショップ、写真撮影、ロケ撮影、商品撮影、商用撮影、ストックフォト、キッチンスタジオ、撮影スタジオ、ハウススタジオ、パーティールーム、レンタルスペース、宿泊可能"
                        /> */}
                        {/* <div className="w-full my-6 border-t border-gray-300" /> */}

                        {/* access section */}
                        <SpaceInfoAccess
                            address={address}
                            nearestStations={nearestStations}
                        />

                        {/* divider */}
                        <div className="w-full my-6 border-t border-gray-300" />
                        {/* Price Plans */}
                        <div>
                            <h2 className="mb-4 text-lg font-bold text-gray-700">
                                料金プラン
                            </h2>
                            {spacePricePlans.map((plan, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between px-5 py-4 my-4 text-xl text-gray-800 border border-gray-100 bg-gray-50 rounded-xl"
                                >
                                    <h3>{plan.title}</h3>
                                    <p>
                                        {PriceFormatter(plan.amount)}
                                        <span className="text-base text-gray-700">
                                            /
                                            {plan.duration > 1
                                                ? plan.duration
                                                : ""}
                                            {plan.type === "HOURLY"
                                                ? "時間"
                                                : "日"}
                                        </span>
                                    </p>
                                </div>
                            ))}
                        </div>
                        {/* divider */}
                        <div className="w-full my-6 border-t border-gray-300" />

                        {/* reviews and comment section */}
                        <SpaceInfoReviews />
                    </div>
                    <div className="hidden md:block">
                        <FloatingPrice
                            pricePlans={spacePricePlans}
                            space={space}
                        />
                    </div>
                </div>
            </Container>

            {/* recommended section */}
            {/* <SpaceInfoRecommended /> */}
        </MainLayout>
    );
};

export default SpaceDetail;

export async function getServerSideProps(context) {
    const { id } = context.query;
    const client = createApolloClient();
    const { data } = await client.query({
        query: GET_SPACE_BY_ID,
        variables: { id },
    });
    const userSession = await getSession(context);
    return { props: { spaceId: id, space: data.spaceById, userSession } };
}
