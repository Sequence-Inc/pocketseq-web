import { FloatingPrice, HostProfile, SpaceUtilities } from "@comp";
import { Button, Rating, Tag } from "@element";
import React from "react";
import { HomeIcon, LightningBoltIcon, LocationMarkerIcon, LockOpenIcon, PhotographIcon, UserGroupIcon, SparklesIcon, TagIcon } from "@heroicons/react/outline";
import { MainLayout } from "@layout";
import { CheckIcon, StarIcon, ShieldCheckIcon } from "@heroicons/react/solid";
import Link from "next/link";

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
            <div className="relative pt-8 mb-8">
                <div className="relative w-full overflow-hidden rounded-lg aspect-w-16 aspect-h-8 lg:aspect-h-6">
                    <img
                        src="https://cdnspacemarket.com/uploads/attachments/776274/image.jpg?fit=crop&width=1200&height=800&bg-color=9c9c9c"
                        alt="category items"
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3">
                    <Button variant="white">
                        <PhotographIcon className="inline-block w-4 h-4 mr-1 text-gray-600" />
                        <span className="hidden sm:inline">
                            すべての写真を表示
                        </span>
                    </Button>
                </div>
            </div>
            <div className="relative flex space-x-12">
                <div className="flex-1">
                    <div className="mb-3">
                        <Tag
                            Icon={LocationMarkerIcon}
                            iconStyle="text-gray-300"
                            textStyle="text-sm text-gray-500"
                            numberOfLines={1}
                        >
                            大阪府大阪市天王寺区
                        </Tag>
                    </div>
                    <h2 className="mb-3 text-xl font-medium text-gray-700">いこい【丸々貸切一軒家・毎回清掃】インドア花見/デート/女子会/撮影/パーティー/おしゃれ/かわいい/キッチン</h2>
                    <div className="flex items-center space-x-3">
                        <Rating />
                        <div className="text-sm">
                            <p className="inline-block font-bold text-gray-600">4.52</p>
                            <span className="text-gray-500">(99件)</span>
                        </div>
                        <Tag
                            Icon={UserGroupIcon}
                            iconStyle="text-gray-400"
                            textStyle="text-sm text-gray-500"
                            numberOfLines={1}
                        >
                            〜15人
                        </Tag>


                        <Tag
                            Icon={HomeIcon}
                            iconStyle="text-gray-400"
                            textStyle="text-sm text-gray-500"
                            numberOfLines={1}
                        >
                            24m
                        </Tag>


                        <Tag
                            Icon={TagIcon}
                            iconStyle="text-gray-400"
                            textStyle="text-sm text-gray-500"
                            numberOfLines={1}
                        >
                            貸し会議室
                        </Tag>
                    </div>

                    {/* divider */}
                    <div className="w-full my-6 border-t border-gray-300" />

                    {/* space utilities */}
                    <div className="space-y-4">
                        <SpaceUtilities
                            Icon={LightningBoltIcon}
                            title="トップホストのスペースです"
                            description="トップホストとは、スペースマーケットの設定する条件をクリアした優良ホストに対して送られる称号です。"
                        />
                        <SpaceUtilities
                            Icon={SparklesIcon}
                            title="優れた清潔感"
                            description="最近このスペースを利用したゲストの100％が清潔だったと言っています。"
                        />
                        <SpaceUtilities
                            Icon={LockOpenIcon}
                            title="スムーズな入退室"
                            description="最近このスペースを利用したゲストの100％が、入退室がスムーズだったと言っています。"
                        />
                        <SpaceUtilities
                            Icon={CheckIcon}
                            title="感染症対策の実施"
                            description="このスペースは利用された後、スタッフが毎回必ず清掃と除菌を行なっています。"
                        />
                    </div>

                    {/* divider */}
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
        </MainLayout>
    );
};

export default SpaceDetail;
