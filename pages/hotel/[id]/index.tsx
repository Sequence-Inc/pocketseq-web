import {
    HostProfile,
    SpaceUtilities,
    SpaceInfoTitle,
    SpaceInfoBanner,
    SpaceInfoAccess,
    SpaceInfoReviews,
    ISpaceInfoTitleProps,
} from "@comp";
import { Button, Container, Rating, Tag } from "@element";
import React, { useState } from "react";
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

import createApolloClient from "src/apollo/apolloClient";
import { getSession } from "next-auth/react";
import { FloatingPriceThree } from "src/components/FloatingPriceThree";
import { durationSuffix } from "src/components/Space/PricingPlan";
import { GET_HOTEL_BY_ID } from "src/apollo/queries/hotel.queries";
import { LocationMarkerIcon, UserGroupIcon } from "@heroicons/react/outline";
import { Rooms } from "src/components/HotelSpace";

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

const SpaceDetail = ({ hotelId, hotel, userSession }) => {
    const [selectedPlan, setSelectedPlan] = useState(null);

    const id = hotelId;
    const router = useRouter();
    const {
        name,
        description,
        checkInTime,
        checkOutTime,
        status,
        address,
        nearestStations,
        photos,
        rooms,
        packagePlans,
        createdAt,
        updatedAt,
    } = hotel;

    console.log(hotel);
    const location: string = FormatShortAddress(address);

    const rating: IRating = { points: 5, reviews: 1 }; // Todo: implement ratings for each spaces

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
                    content={`${publicImage(photos[0], "large")}`}
                />
                <meta
                    name="twitter:title"
                    content={`${name} | 「人 × 場所 × 体験」を繋げる 目的に合った場所を検索しよう`}
                />
                <meta
                    property="twitter:image"
                    content={`${publicImage(photos[0], "large")}`}
                />
            </Head>
            <Container className="mt-16">
                <div className="relative flex space-x-12">
                    <div className="w-2/3">
                        <>
                            <SpaceInfoBanner photos={photos} />
                            <div className="text-lg">
                                <Tag
                                    Icon={LocationMarkerIcon}
                                    iconStyle="text-gray-400"
                                    textStyle="text-lg text-gray-400"
                                    numberOfLines={1}
                                >
                                    {location}
                                </Tag>
                            </div>
                            <h2 className="my-3 text-3xl font-bold text-gray-700">
                                {name}
                            </h2>
                            <div className="flex flex-col space-y-2 md:space-x-3 md:space-y-0 md:items-center md:flex-row">
                                <div className="flex space-x-3 items-center">
                                    <Rating />
                                    <div className="text-sm">
                                        <p className="inline-block font-bold text-lg text-gray-600">
                                            {rating.points}
                                        </p>
                                        <span className="text-gray-500 text-lg">
                                            ({rating.reviews}件)
                                        </span>
                                    </div>
                                </div>
                                <div className="text-gray-500 text-lg ml-4">
                                    {rooms.length}寝室
                                </div>
                            </div>
                        </>
                        <div className="block md:hidden">
                            {/* <FloatingPriceTwo
                                pricePlans={pricePlans}
                                space={space}
                            /> */}
                        </div>
                        <div className="w-full my-6 border-t border-gray-300" />
                        <SpaceUtilities />
                        <div className="w-full my-6 border-t border-gray-300" />
                        {/* host profile */}
                        <div>
                            <div className="space-y-6 sm:flex sm:space-y-0">
                                <div className="flex-1">
                                    {/* <HostProfile
                                        title={host?.name}
                                        description="2015年8月年からメンバー"
                                    /> */}
                                </div>
                                {/* <Button
                                    variant="primary"
                                    rounded
                                    className="w-auto px-4 h-9"
                                    onClick={sendMessage}
                                >
                                    Send Message
                                </Button> */}
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
                        {/* Package Plans */}
                        <div className="">
                            <h2 className="mb-4 text-lg font-bold text-gray-700">
                                プラン一覧
                            </h2>
                            <div className="flex flex-row space-x-4 w-full overflow-x-auto">
                                {packagePlans.map((plan) => {
                                    // src={room.photos[0].medium.url}
                                    return (
                                        <div
                                            key={plan.id}
                                            className="w-60 rounded-lg"
                                        >
                                            <img
                                                src="https://a0.muscache.com/im/pictures/9cdeb897-97c7-4788-8f96-10f0adef0613.jpg?im_w=720"
                                                className="w-60 h-40 rounded-lg bg-gray-200"
                                            />
                                            <div className=" space-y-1 py-2 mt-2">
                                                <h3 className="font-bold text-lg">
                                                    {plan.name}
                                                </h3>
                                                <p>{plan.description}</p>
                                                <div className="pt-2">
                                                    <button
                                                        onClick={() =>
                                                            setSelectedPlan(
                                                                plan
                                                            )
                                                        }
                                                        className="bg-primary w-full py-2 px-4 text-white font-bold rounded hover:bg-primaryHover"
                                                    >
                                                        予約
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="w-full my-6 border-t border-gray-300" />
                        {/* Rooms */}
                        <div>
                            <h2 className="mb-4 text-lg font-bold text-gray-700">
                                寝室・ベッドについて
                            </h2>
                            <div className="flex flex-row space-x-4 overflow-x-scroll">
                                {rooms.map((room) => {
                                    // src={room.photos[0].medium.url}
                                    return (
                                        <div
                                            key={room.id}
                                            className="w-60 rounded-lg"
                                        >
                                            <img
                                                src="https://a0.muscache.com/im/pictures/9cdeb897-97c7-4788-8f96-10f0adef0613.jpg?im_w=720"
                                                className="w-60 h-40 rounded-lg bg-gray-200"
                                            />
                                            <div className=" space-y-1 py-2 mt-2">
                                                <h3 className="font-bold text-lg">
                                                    {room.name}
                                                </h3>
                                                <p>{room.description}</p>
                                                <p>
                                                    大人{room.maxCapacityAdult}
                                                    {room.maxCapacityChild > 0
                                                        ? `・子供${room.maxCapacityChild}`
                                                        : ""}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* divider */}
                        <div className="w-full my-6 border-t border-gray-300" />

                        {/* Services / equipment */}
                        <ContentSection
                            title="サービス・設備"
                            description="ママ会、女子会、おうちデート、映画鑑賞、カップル利用、ファミリー会（子連れ歓迎）、誕生日会、セミナー、ワークショップ、写真撮影、ロケ撮影、商品撮影、商用撮影、ストックフォト、キッチンスタジオ、撮影スタジオ、ハウススタジオ、パーティールーム、レンタルスペース、宿泊可能"
                        />
                        <div className="w-full my-6 border-t border-gray-300" />

                        {/* access section */}
                        <SpaceInfoAccess
                            address={address}
                            nearestStations={nearestStations}
                        />

                        {/* divider */}
                        <div className="w-full my-6 border-t border-gray-300" />

                        {/* reviews and comment section */}
                        <div>
                            <SpaceInfoReviews />
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <FloatingPriceThree
                            plans={packagePlans}
                            currentPlan={selectedPlan}
                        />
                    </div>
                </div>
            </Container>
        </MainLayout>
    );
};

export default SpaceDetail;

export async function getServerSideProps(context) {
    const { id } = context.query;
    const client = createApolloClient();
    try {
        const { data } = await client.query({
            query: GET_HOTEL_BY_ID,
            variables: { id },
        });
        const userSession = await getSession(context);
        return { props: { hotelId: id, hotel: data.hotelById, userSession } };
    } catch (error) {
        console.log(error);
        return { props: {} };
    }
}
