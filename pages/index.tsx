import Head from "next/head";
import { Container, Tag } from "@element";
import {
    CategoryItem,
    ItemGrid,
    IItemGrid,
    ICategoryItem,
    IExploreItem,
    RegisterCTA,
    SingleExploreItem,
    HeroSection,
} from "@comp";
import { Header, Footer } from "@layout";

import {
    FlagIcon,
    StarIcon,
    LocationMarkerIcon,
    ChevronRightIcon,
} from "@heroicons/react/outline";

export const itemGridData: IItemGrid[] = [
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

const categories: ICategoryItem[] = [
    {
        title: "イベントスペース",
        subTitle: "123件",
        photo: "https://cdnspacemarket.com/packs-production/images/top/img_venue1-2f441630d1.jpg",
    },
    {
        title: "貸し会議室",
        subTitle: "123件",
        photo: "https://cdnspacemarket.com/packs-production/images/top/img_venue2-d1bcd206b2.jpg",
    },
    {
        title: "おうちスペース",
        subTitle: "123件",
        photo: "https://cdnspacemarket.com/packs-production/images/top/img_venue3-ee70adf998.jpg",
    },
    {
        title: "撮影スタジオ",
        subTitle: "123件",
        photo: "https://cdnspacemarket.com/packs-production/images/top/img_venue4-e153758527.jpg",
    },
    {
        title: "レンタルスタジオ",
        subTitle: "123件",
        photo: "https://cdnspacemarket.com/packs-production/images/top/img_venue5-bc39e6a2f9.jpg",
    },
    {
        title: "古民家",
        subTitle: "123件",
        photo: "https://cdnspacemarket.com/packs-production/images/top/img_venue6-e6918eba9d.jpg",
    },
    {
        title: "屋上・テラス",
        subTitle: "123件",
        photo: "https://cdnspacemarket.com/packs-production/images/top/img_venue7-10da6595b7.jpg",
    },
    {
        title: "レンタルジム",
        subTitle: "123件",
        photo: "https://cdnspacemarket.com/packs-production/images/top/img_venue8-cd826d045a.jpg",
    },
];

const exploreAreas: IExploreItem[] = [
    {
        name: "新宿",
        distance: "3.5km",
        photo: "https://cdnspacemarket.com/packs-production/images/top/img_area_tokyo-shinjuku-77442606d9.jpg",
    },
    {
        name: "渋谷",
        distance: "3.5km",
        photo: "https://cdnspacemarket.com/packs-production/images/top/img_area_tokyo-shibuya-e4e48ba97b.jpg",
    },
    {
        name: "池袋",
        distance: "3.5km",
        photo: "https://cdnspacemarket.com/packs-production/images/top/img_area_tokyo-ikebukuro-ce159c8b7e.jpg",
    },
    {
        name: "原宿",
        distance: "3.5km",
        photo: "https://cdnspacemarket.com/packs-production/images/top/img_area_tokyo-harajuku-087e2c5ed1.jpg",
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
                        <div className="flex items-center justify-between px-1 pb-3 mb-6 border-b border-gray-200">
                            <Tag
                                Icon={FlagIcon}
                                iconSize={6}
                                iconStyle="mr-2 text-primary"
                                textStyle="text-xl text-primary"
                            >
                                目的に応じて探す
                            </Tag>
                            <a
                                href="#"
                                className="flex items-center text-xs text-gray-500 hover:text-primary"
                            >
                                もっと見る
                                <ChevronRightIcon className="w-4 h-4 ml-1" />
                            </a>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:gap-x-6 gap-y-6">
                            {categories.map((category, index) => (
                                <CategoryItem
                                    key={index.toString()}
                                    title={category.title}
                                    subTitle={category.subTitle}
                                    photo={category.photo}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between px-1 pb-3 mb-6 border-b border-gray-200">
                            <Tag
                                Icon={LocationMarkerIcon}
                                iconSize={6}
                                iconStyle="mr-2 text-primary"
                                textStyle="text-xl text-primary"
                            >
                                近くのエリアから探す
                            </Tag>
                            <a
                                href="#"
                                className="flex items-center text-xs text-gray-500 hover:text-primary"
                            >
                                もっと見る
                                <ChevronRightIcon className="w-4 h-4 ml-1" />
                            </a>
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
                    </div>
                    <div>
                        <div className="flex items-center justify-between px-1 pb-3 mb-6 border-b border-gray-200">
                            <Tag
                                Icon={StarIcon}
                                iconSize={6}
                                iconStyle="mr-2 text-primary"
                                textStyle="text-xl text-primary"
                            >
                                新着ピックアップスペース
                            </Tag>
                            <a
                                href="#"
                                className="flex items-center text-xs text-gray-500 hover:text-primary"
                            >
                                もっと見る
                                <ChevronRightIcon className="w-4 h-4 ml-1" />
                            </a>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {itemGridData.map((item, index) => (
                                <ItemGrid key={index} data={item} />
                            ))}
                        </div>
                    </div>
                    <RegisterCTA />
                </Container>
            </main>

            <Footer />
        </div>
    );
}
