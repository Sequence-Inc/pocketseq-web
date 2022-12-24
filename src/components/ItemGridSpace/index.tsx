import React from "react";
import Link from "next/link";
import {
    LocationMarkerIcon,
    StarIcon,
    HeartIcon,
} from "@heroicons/react/solid";
import { Button, Tag } from "@element";
import router from "next/router";

import { IPhoto } from "../../types/timebookTypes";
import { FormatPrice, FormatShortAddress, PriceFormatter } from "src/utils";
import { HomeIcon, UserGroupIcon } from "@heroicons/react/outline";

export interface ItemGridHotelProps {
    data: any;
    activeIndex?: string | number;
    setActiveIndex?: any;
}

export const ItemGridSpace = ({
    data,
    activeIndex,
    setActiveIndex,
}: ItemGridHotelProps) => {
    const {
        id,
        name,
        thumbnail,
        price,
        priceUnit,
        maxAdult,
        maxChild,
        type,
        address,
        category,
    } = data;

    const rating = { points: 5, reviews: 1 }; // Todo: implement ratings for each spaces

    return (
        <div
            className={`p-2 space-y-4 bg-white rounded-2xl ${
                activeIndex === id ? "bg-gray-100" : ""
            }`}
            onMouseEnter={() => setActiveIndex && setActiveIndex(data?.id)}
            onMouseLeave={() => setActiveIndex && setActiveIndex(-1)}
        >
            <div className="w-full overflow-hidden rounded-lg aspect-w-16 aspect-h-9 z-0">
                <Link href={`/${type}/${encodeURIComponent(id)}`}>
                    <img
                        src={thumbnail}
                        alt={name}
                        className="object-cover object-left-top w-full h-full z-0"
                    />
                </Link>
            </div>
            <div className="md:px-2 space-y-2">
                {/* location and rating section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <Tag
                        Icon={LocationMarkerIcon}
                        iconStyle="text-gray-300"
                        textStyle="text-sm text-gray-500"
                        numberOfLines={1}
                    >
                        {address}
                    </Tag>

                    {/* <Tag Icon={StarIcon} iconStyle="h-5 w-5 text-yellow-400">
                        <div className="text-sm font-semibold text-gray-600">
                            {rating.points}{" "}
                            <span className="font-light text-gray-400">
                                ({rating.reviews}件)
                            </span>
                        </div>
                    </Tag> */}
                    <div>&nbsp;</div>
                </div>
                {/* title section */}
                <Link href={`/${type}/${encodeURIComponent(id)}`}>
                    <a className="block">
                        <h3 className="text-gray-800 line-clamp-1 text-lg font-bold">
                            {name}
                        </h3>
                    </a>
                </Link>
                {/* price section */}
                <div className="text-xl font-bold">
                    {PriceFormatter(price)}
                    <span className="font-normal text-base">
                        {" "}
                        /{priceUnit}〜
                    </span>
                </div>

                {/* metadata section */}
                <div className="hidden md:flex justify-start space-x-4">
                    <Tag
                        Icon={UserGroupIcon}
                        textStyle="text-sm text-gray-500"
                        iconStyle="text-gray-300"
                    >
                        {`〜${maxAdult + maxChild}`}名
                    </Tag>
                    <Tag
                        Icon={HomeIcon}
                        textStyle="text-sm text-gray-500"
                        iconStyle="text-gray-300"
                    >
                        {category}
                    </Tag>
                    {/* <Tag
                        Icon={TagIcon}
                        textStyle="text-sm text-gray-500"
                        iconStyle="text-gray-300"
                        numberOfLines={1}
                    >
                        {spaceType.title}
                    </Tag> */}
                </div>

                {/* action section */}
                <div className="flex flex-col md:flex-row justify-between py-2 space-y-2 md:space-y-0 md:space-x-4">
                    <Button
                        variant="primary"
                        onClick={() => router.push(`/${type}/${id}`)}
                    >
                        もっと見る
                    </Button>
                    <Button>
                        <HeartIcon className="inline-block w-4 h-4 mr-1 text-gray-300" />
                        <span>保存</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};
