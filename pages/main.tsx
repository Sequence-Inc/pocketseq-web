import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Container, Tag } from "@element";
import {
    CategoryItem,
    ItemGrid,
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
    BookmarkAltIcon,
    FireIcon,
    ShieldCheckIcon,
} from "@heroicons/react/outline";
import { useQuery } from "@apollo/client";
import {
    GET_AVAILABLE_SPACE_TYPES,
    GET_TOP_PICK_SPACES,
} from "src/apollo/queries/space.queries";

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

const features = [
    {
        name: "Secure",
        icon: ShieldCheckIcon,
        description:
            "何とかごくごくおしまいがセロをむしっなた。みんなしばらくに譜を云いのに顔を思っだます。",
    },
    {
        name: "Save Spaces",
        icon: BookmarkAltIcon,
        description:
            "何とかごくごくおしまいがセロをむしっなた。みんなしばらくに譜を云いのに顔を思っだます。",
    },
    {
        name: "Popular",
        icon: FireIcon,
        description:
            "何とかごくごくおしまいがセロをむしっなた。みんなしばらくに譜を云いのに顔を思っだます。",
    },
];

export default function Home() {
    const { data: spaceTypes } = useQuery(GET_AVAILABLE_SPACE_TYPES, {
        fetchPolicy: "network-only",
    });

    const { data: topPicks } = useQuery(GET_TOP_PICK_SPACES, {
        variables: {
            paginationInfo: {
                take: 4,
                skip: 0,
            },
        },
        fetchPolicy: "network-only",
    });

    return (
        <div className="bg-gray-50">
            <Head>
                <title>time book</title>
            </Head>
            <Header />
            <main>
                <HeroSection />
                <Container className="py-12 space-y-12 md:py-20 md:space-y-20">
                    {/* Blob */}
                    <div>
                        <div className="relative">
                            <div className="mx-auto text-center">
                                <p className="mt-2 text-2xl tracking-tight text-primary sm:text-3xl">
                                    time bookとは
                                </p>
                                <p className="w-2/3 mx-auto mt-6 text-xl font-light text-gray-500">
                                    会議やPartyの場所を探している人、顧客や技術はあるが提供する場所がない人、そんな人たちのやりたい事場所が全部見つかる
                                </p>
                                <div className="mt-12">
                                    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:gap-x-6 gap-y-6">
                            {spaceTypes?.availableSpaceTypes.map(
                                (spaceType, index) => (
                                    <CategoryItem
                                        key={spaceType.id}
                                        title={spaceType.title}
                                        subTitle={spaceType.description}
                                        photo={spaceType.photo?.medium?.url}
                                    />
                                )
                            )}
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
                            <Link href="/search">
                                <a className="flex items-center text-xs text-gray-500 hover:text-primary">
                                    もっと見る
                                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                                </a>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {topPicks?.allSpaces?.data.map((item, index) => (
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
