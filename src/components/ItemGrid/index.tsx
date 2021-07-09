import React from "react";
import {
    LocationMarkerIcon,
    StarIcon,
    TagIcon,
    UserGroupIcon,
    HomeIcon,
    HeartIcon,
} from "@heroicons/react/solid";
import { Button, Price, Tag, Title } from "@element";
import Link from "next/link";

export interface IItemGrid {
    id?: string | number;
    location: string;
    rating: number;
    cases: number;
    title: string;
    price: number;
    people: number;
    area: string;
    tag: string;
    photo: string;
}

export interface ItemGridProps {
    data: IItemGrid;
}

export const ItemGrid = ({ data }: ItemGridProps) => {
    return (
        <div className="p-2 space-y-4 bg-white rounded-2xl">
            <div className="w-full overflow-hidden rounded-lg aspect-w-16 aspect-h-9">
                <img
                    src={data?.photo}
                    alt={data?.title}
                    className="object-left-topw-full h-full object-cover"
                />
            </div>
            <div className="px-2 space-y-2">
                {/* location and rating section */}
                <div className="flex items-center justify-between">
                    <Tag
                        Icon={LocationMarkerIcon}
                        iconStyle="text-gray-300"
                        textStyle="text-sm text-gray-500"
                        numberOfLines={1}
                    >
                        {data?.location}
                    </Tag>

                    <Tag Icon={StarIcon} iconStyle="h-5 w-5 text-yellow-400">
                        <div className="text-sm font-semibold text-gray-600">
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
                    <Tag
                        Icon={UserGroupIcon}
                        textStyle="text-sm text-gray-500"
                        iconStyle="text-gray-300"
                    >{`〜${data?.people}人`}</Tag>
                    <Tag
                        Icon={HomeIcon}
                        textStyle="text-sm text-gray-500"
                        iconStyle="text-gray-300"
                    >
                        {data?.area}
                    </Tag>
                    <Tag
                        Icon={TagIcon}
                        textStyle="text-sm text-gray-500"
                        iconStyle="text-gray-300"
                        numberOfLines={1}
                    >
                        {data?.tag}
                    </Tag>
                </div>

                {/* action section */}
                <div className="flex justify-between py-2 space-x-4">
                    <Link href={`/space/${data?.id}`}>
                        <Button variant="primary">もっと見る</Button>
                    </Link>
                    <Button>
                        <HeartIcon className="inline-block w-4 h-4 mr-1 text-gray-300" />
                        <span>保存</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};
