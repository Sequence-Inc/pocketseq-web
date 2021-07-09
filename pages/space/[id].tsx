import { FloatingPrice, HostProfile, ItemGrid, SpaceUtilities, SpaceInfoTitle, SpaceInfoBanner, SpaceInfoRecommended } from "@comp";
import { Button, Container, Tag } from "@element";
import React from "react";
import { LocationMarkerIcon } from "@heroicons/react/outline";
import { MainLayout } from "@layout";
import { StarIcon, ShieldCheckIcon, ChevronRightIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { itemGridData } from "..";

const ContentSection = ({ title, description }: { title: string, description: string }) => {
    return (
        <div>
            <p className="mb-4 text-lg font-bold text-gray-700">{title}</p>
            <div className="mb-4 text-sm text-gray-500">
                {description}
            </div>
            <Link href="/">
                <a className="text-gray-600 underline">もっと見る</a>
            </Link>
        </div>
    )
}

const SpaceDetail = () => {
    return (
        <MainLayout>
            <Container className="mt-16">
                <SpaceInfoBanner />
                <div className="relative flex space-x-12">
                    <div className="flex-1">
                        <SpaceInfoTitle />
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
                            description="総面積1000㎡、BBQ場付きの完全なプライベート空間！
                    オーナーの遊び心いっぱいの、とても素敵なログハウスです！

                    樹木の香りのする森の中で、大人も子どもも贅沢な時間を楽しめます。リビングにはミラーボールやプロジェクター、壁掛スクリーンがあり、ご家族や仲間内でのパーティーに最適です。"
                        />

                        {/* divider */}
                        <div className="w-full my-6 border-t border-gray-300" />


                        {/* Services / equipment */}
                        <ContentSection
                            title="サービス・設備"
                            description="ママ会、女子会、おうちデート、映画鑑賞、カップル利用、ファミリー会（子連れ歓迎）、誕生日会、セミナー、ワークショップ、写真撮影、ロケ撮影、商品撮影、商用撮影、ストックフォト、キッチンスタジオ、撮影スタジオ、ハウススタジオ、パーティールーム、レンタルスペース、宿泊可能"
                        />

                    </div>
                    <div className="hidden md:block">
                        <FloatingPrice />
                    </div>
                </div>
            </Container>

            {/* recommended section */}
            <SpaceInfoRecommended />

        </MainLayout>
    );
};

export default SpaceDetail;
