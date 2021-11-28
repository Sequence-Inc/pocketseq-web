import {
    FloatingPrice,
    HostProfile,
    SpaceUtilities,
    SpaceInfoTitle,
    SpaceInfoBanner,
    SpaceInfoRecommended,
    SpaceInfoAccess,
    SpaceInfoReviews,
    ISpaceInfoTitleProps,
    LoadingSpinner,
} from "@comp";
import { Button, Container, Tag } from "@element";
import React from "react";
import { MainLayout } from "@layout";
import { StarIcon, ShieldCheckIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client";
import { GET_SPACE_BY_ID } from "src/apollo/queries/space.queries";
import { FormatPrice, FormatShortAddress, PriceFormatter } from "src/utils";
import { IPhoto, IRating, ISpace } from "src/types/timebookTypes";
import Head from "next/head";
import { CREATE_NEW_CHAT } from "src/apollo/queries/chat.queries";
import { useRouter } from "next/router";

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

const SpaceDetail = ({ spaceId }) => {
    const router = useRouter();
    const { data, loading, error } = useQuery(GET_SPACE_BY_ID, {
        variables: { id: spaceId },
        fetchPolicy: "network-only"
    });

    if (error) {
        console.log("error while loading space");
        return <h3>Error occurred. Please contact administrator</h3>;
    }

    if (loading) {
        return <h3>Loading...</h3>;
    }

    const space: ISpace = data.spaceById;
    const {
        id,
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
        if (host) router.push(`/messages?name=${host?.name}&recipientIds=${host?.accountId}`);
    }

    return (
        <MainLayout>
            <Head>
                <title>{name} - time book</title>
            </Head>
            <Container className="mt-16">
                <div className="relative flex space-x-12">
                    <div className="flex-1">
                        <div className="h-6"></div>
                        <SpaceInfoTitle titleInfo={titleInfo} />
                        <SpaceInfoBanner photos={photos} />
                        <div className="w-full my-6 border-t border-gray-300" />
                        <SpaceUtilities />
                        <div className="w-full my-6 border-t border-gray-300" />
                        {/* host profile */}
                        <div>
                            <div className="space-y-6 sm:flex sm:space-y-0">
                                <div className="flex-1">{console.log(host)}
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
    return { props: { spaceId: id } };
}
