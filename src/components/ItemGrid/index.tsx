import React from "react";
import Image from "next/image";
import {
    LocationMarkerIcon,
    StarIcon,
    TagIcon,
    UserGroupIcon,
    HomeIcon,
    HeartIcon,
} from "@heroicons/react/solid";
import { Button, Price, Tag, Title } from "@element/index";

export interface IItemGrid {
    location: string;
    rating: number;
    cases: number;
    title: string;
    price: number;
    people: number;
    area: string;
    tag: string;
}

export interface ItemGridProps {
    data: IItemGrid;
}

export const ItemGrid = ({ data }: ItemGridProps) => {
    return (
        <div className="p-2 bg-white rounded-2xl space-y-4">
            <div className="w-full aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <Image
                    src="/itemGrid.svg"
                    alt="category items"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                />
            </div>
            <div className="space-y-2 px-2">
                {/* location and rating section */}
                <div className="flex items-center justify-between">
                    <Tag
                        Icon={LocationMarkerIcon}
                        IconStyle="text-gray-300"
                        numberOfLines={1}
                    >
                        {data?.location}
                    </Tag>

                    <Tag Icon={StarIcon} IconStyle="h-5 w-5 text-yellow-400">
                        <div className="text-gray-600 text-sm font-semibold">
                            {data?.rating}{" "}
                            <span className="font-light text-gray-400">
                                ({data?.cases}件)
                            </span>
                        </div>
                    </Tag>
                </div>

                {/* title section */}
                <Title numberOfLines={2}>{data?.title}</Title>

                {/* price section */}
                <Price amount={data?.price} />

                {/* metadata section */}
                <div className="flex justify-start space-x-4">
                    <Tag Icon={UserGroupIcon}>{`〜${data?.people}人`}</Tag>
                    <Tag Icon={HomeIcon}>{data?.area}</Tag>
                    <Tag Icon={TagIcon}>{data?.tag}</Tag>
                </div>

                {/* action section */}
                <div className="flex justify-between py-2 space-x-4">
                    <Button variant="primary">もっと見る</Button>
                    <Button>
                        <HeartIcon className="w-4 h-4 text-gray-300 inline-block mr-1" />
                        <span>保存</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};
