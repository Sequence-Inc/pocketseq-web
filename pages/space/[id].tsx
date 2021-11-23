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
} from "@comp";
import { Container, Tag } from "@element";
import React from "react";
import { MainLayout } from "@layout";
import { StarIcon, ShieldCheckIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_SPACE_BY_ID } from "src/apollo/queries/space.queries";
import { FormatPrice, FormatShortAddress, PriceFormatter } from "src/utils";
import { IPhoto, IRating, ISpace } from "src/types/timebookTypes";
import Head from "next/head";

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
    const { data, loading, error } = useQuery(GET_SPACE_BY_ID, {
        variables: { id: spaceId },
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
                            <HostProfile
                                title="ホストはZero Share (株式会社LDKプロジェクト)さん"
                                description="2015年8月年からメンバー"
                            />
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
                                    className="flex justify-between text-xl py-4 px-5 my-4 text-gray-800 bg-gray-50 rounded-xl border border-gray-100"
                                >
                                    <h3>{plan.title}</h3>
                                    <p>
                                        {PriceFormatter(plan.amount)}
                                        <span className="text-gray-700 text-base">
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
                        <FloatingPrice pricePlans={spacePricePlans} />
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
