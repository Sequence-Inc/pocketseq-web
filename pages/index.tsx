import Head from "next/head";
import { Container, Tag } from "@element";
import {
    CategoryItem,
    ItemGrid,
    IItemGrid,
    // SingleListItem,
    // ReviewItem,
    // SingleReview,
    RegisterCTA,
    // IReviewComment,
    SingleExploreItem,
    HeroSection,
} from "@comp";
import { Header, Footer } from "@layout";

import { FlagIcon, StarIcon, LocationMarkerIcon } from "@heroicons/react/outline";

// const reviewComment: IReviewComment[] = [
//     {
//         name: "Name",
//         date: "2021年6月",
//         comment: "清潔さ",
//     },
// ];

const itemGridData: IItemGrid[] = [
    {
        id: 1,
        photo: "https://cdnspacemarket.com/uploads/attachments/445622/image.jpg?fit=crop&width=1200&height=800&bg-color=9c9c9c",
        location: "東京都渋谷区",
        rating: 4.1,
        cases: 328,
        title: "108【シェアスペORENGE新宿】🎇スパークリング割🎇定期消毒✨テレワーク✨新宿駅3分✨最大12名✨会議✨パーティ",
        price: 1131,
        people: 12,
        area: "32m²",
        tag: "おうちスペース",
    },
    {
        id: 2,
        photo: "https://cdnspacemarket.com/uploads/attachments/315502/image.jpg?fit=crop&width=1200&height=800&bg-color=9c9c9c",
        location: "東京都新宿区",
        rating: 4.6,
        cases: 415,
        title: "013_fika新宿御苑🌿夏割🌊最大24名収容⭕新宿三丁目3分＆新宿御苑駅3分🚶‍♂️65型TV📺本格キッチン🍴Wi-Fi📶",
        price: 1732,
        people: 30,
        area: "60m²",
        tag: "イベントスペース",
    },
    {
        id: 3,
        photo: "https://cdnspacemarket.com/uploads/attachments/693445/image.jpg?fit=crop&width=1200&height=800&bg-color=9c9c9c",
        location: "東京都渋谷区",
        rating: 4.2,
        cases: 13,
        title: "夏割⛵定期除菌🌟新宿駅徒歩３分【ティファニー会議室】清潔素敵空間🌈撮影OK📸会議/セミナー/女子会",
        price: 1732,
        people: 6,
        area: "19m²",
        tag: "貸し会議室",
    },
    {
        id: 3,
        photo: "https://cdnspacemarket.com/uploads/attachments/776274/image.jpg?fit=crop&width=1200&height=800&bg-color=9c9c9c",
        location: "東京都新宿区",
        rating: 4.7,
        cases: 123,
        title: "mysa新宿4th🌿夏割🌊🉐新宿5分WiFiでか📺広々ソファ🛋️大人気ゲーム機🎮ネトフリ/女子会/パーティ/撮影/おうちデート",
        price: 623,
        people: 6,
        area: "30m²",
        tag: "おうちスペース",
    },
];

export default function Home() {
    return (
        <div className="bg-gray-50">
            <Head>
                <title>Home | Space Rental</title>
            </Head>
            <Header />
            <main>
                <HeroSection />
                <Container className="py-12 space-y-12 md:py-20 md:space-y-20">
                    <div>
                        <div className="pb-3 mb-6 border-b border-gray-200">
                            <Tag
                                Icon={FlagIcon}
                                iconSize={6}
                                iconStyle="mr-2 text-primary"
                                textStyle="text-xl text-primary"
                            >
                                目的に応じて探す
                            </Tag>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:gap-x-6 gap-y-6">
                            {Array(8)
                                .fill(0)
                                .map((res, index) => (
                                    <CategoryItem
                                        key={index}
                                        title="イベントスペース"
                                        subTitle="113件"
                                    />
                                ))}
                        </div>
                    </div>
                    <div>
                        <div className="pb-3 mb-6 border-b border-gray-200">
                            <Tag
                                Icon={LocationMarkerIcon}
                                iconSize={6}
                                iconStyle="mr-2 text-primary"
                                textStyle="text-xl text-primary"
                            >
                                近くのエリアから探す
                            </Tag>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:gap-x-6 gap-y-6">
                            {Array(8)
                                .fill(0)
                                .map((res, index) => (
                                    <SingleExploreItem key={index} />
                                ))}
                        </div>
                    </div>
                    <div>
                        <div className="pb-3 mb-6 border-b border-gray-200">
                            <Tag
                                Icon={StarIcon}
                                iconSize={6}
                                iconStyle="mr-2 text-primary"
                                textStyle="text-xl text-primary"
                            >
                                新着ピックアップスペース
                            </Tag>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {itemGridData.map((item, index) => (
                                <ItemGrid key={index} data={item} />
                            ))}
                        </div>
                    </div>
                    <RegisterCTA />
                    {/* <SingleListItem data={itemGridData[0]} />
                    <div className="grid max-w-3xl grid-cols-1 py-5 space-y-2 sm:grid-cols-2">
                        {[4.4, 4.0, 2.0, 3.2].map((res, index) => (
                            <ReviewItem
                                key={index}
                                id={`review${index}`}
                                title="清潔さ"
                                value={res}
                                className="mr-16"
                            />
                        ))}
                    </div>
                    <div className="pb-5">
                        <SingleReview data={reviewComment[0]} />
                    </div> */}
                </Container>
            </main>

            <Footer />
        </div>
    );
}
