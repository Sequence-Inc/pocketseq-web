import React, { ReactComponentElement } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    LocationMarkerIcon,
    StarIcon,
    TagIcon,
    UserGroupIcon,
    HomeIcon,
    HeartIcon,
} from "@heroicons/react/solid";
import { Button, Price, Tag, Title } from "@element";
import router from "next/router";

import { IPhoto, ISpace } from "../../types/timebookTypes";
import { FormatPrice, FormatShortAddress } from "src/utils";

export interface ItemGridProps {
    data: ISpace;
    activeIndex?: string | number;
    setActiveIndex?: any;
}

export const ItemGrid = ({
    data,
    activeIndex,
    setActiveIndex,
}: ItemGridProps) => {
    const {
        id,
        name,
        description,
        maximumCapacity,
        spaceSize,
        spaceTypes,
        pricePlans,
        address,
        photos,
    } = data;

    const location: string = FormatShortAddress(address);
    const spaceType = spaceTypes[0]; // Todo: implement multiple space types later

    const rating = { points: 5, reviews: 1 }; // Todo: implement ratings for each spaces

    const photo: IPhoto = photos.find((item) => !!item?.medium?.url);

    return (
        <div
            className={`p-2 space-y-4 bg-white rounded-2xl ${
                activeIndex === id ? "bg-gray-100" : ""
            }`}
            onMouseEnter={() => setActiveIndex && setActiveIndex(data?.id)}
            onMouseLeave={() => setActiveIndex && setActiveIndex(-1)}
        >
            <div className="w-full overflow-hidden rounded-lg aspect-w-16 aspect-h-9 z-0">
                <Image
                    layout="fill"
                    src={photo.medium.url}
                    alt={name}
                    className="object-cover object-left-top w-full h-full z-0"
                />
            </div>
            <div className="md:px-2 space-y-2">
                {/* location and rating section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <Tag
                        Icon={LocationMarkerIcon}
                        iconStyle="text-gray-300"
                        textStyle="text-sm text-gray-500"
                        numberOfLines={1}
                    >
                        {location}
                    </Tag>

                    <Tag Icon={StarIcon} iconStyle="h-5 w-5 text-yellow-400">
                        <div className="text-sm font-semibold text-gray-600">
                            {rating.points}{" "}
                            <span className="font-light text-gray-400">
                                ({rating.reviews}件)
                            </span>
                        </div>
                    </Tag>
                </div>

                {/* title section */}
                <Link href={`/space/${encodeURIComponent(id)}`}>
                    <a className="block">
                        <h3 className="text-gray-800 line-clamp-1 text-lg font-bold">
                            {name}
                        </h3>
                    </a>
                </Link>
                {/* price section */}
                <Price
                    amount={FormatPrice("HOURLY", pricePlans, true, true)}
                    amountStyle="font-bold"
                />

                {/* metadata section */}
                <div className="hidden md:flex justify-start space-x-4">
                    <Tag
                        Icon={UserGroupIcon}
                        textStyle="text-sm text-gray-500"
                        iconStyle="text-gray-300"
                    >{`〜${maximumCapacity}人`}</Tag>
                    <Tag
                        Icon={HomeIcon}
                        textStyle="text-sm text-gray-500"
                        iconStyle="text-gray-300"
                    >
                        {spaceSize}m²
                    </Tag>
                    <Tag
                        Icon={TagIcon}
                        textStyle="text-sm text-gray-500"
                        iconStyle="text-gray-300"
                        numberOfLines={1}
                    >
                        {spaceType.title}
                    </Tag>
                </div>

                {/* action section */}
                <div className="flex flex-col md:flex-row justify-between py-2 space-y-2 md:space-y-0 md:space-x-4">
                    <Button
                        variant="primary"
                        onClick={() => router.push(`/space/${data?.id}`)}
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
