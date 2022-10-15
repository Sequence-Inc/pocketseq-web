import React from "react";
import {
    LocationMarkerIcon,
    StarIcon,
    TagIcon,
    UserGroupIcon,
    HomeIcon,
    HeartIcon,
} from "@heroicons/react/solid";
import { ItemGridProps } from "@comp";
import { Button, Price, Tag, Title } from "@element";
import Image from "next/image";
import router from "next/router";
import { FormatPrice, FormatShortAddress } from "src/utils";
import { IPhoto, ISpace } from "../../types/timebookTypes";

export const SingleListItem = ({
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
        spacePricePlans,
        address,
        photos,
    } = data;

    const location: string = FormatShortAddress(address);
    const spaceType = spaceTypes[0]; // Todo: implement multiple space types later

    const rating = { points: 5, reviews: 1 }; // Todo: implement ratings for each spaces

    const photo: IPhoto = photos[0];

    return (
        <div
            className={`flex flex-col sm:flex-row space-x-6 ${
                activeIndex === data?.id ? "bg-gray-50" : ""
            }`}
            onMouseEnter={() => setActiveIndex && setActiveIndex(data?.id)}
            onMouseLeave={() => setActiveIndex && setActiveIndex(-1)}
        >
            <div className="w-full overflow-hidden rounded-lg sm:w-60 aspect-w-16 aspect-h-9 sm:aspect-h-1">
                <img src={photo.medium?.url} alt={name} />
            </div>
            <div className="w-full space-y-2">
                <Title>{name}</Title>
                {/* price section */}
                <div className="flex items-end space-x-4">
                    <Price
                        amount={FormatPrice(
                            "HOURLY",
                            spacePricePlans,
                            true,
                            true
                        )}
                    />
                    <Tag
                        Icon={StarIcon}
                        iconSize={5}
                        iconStyle="text-yellow-400"
                    >
                        <div className="text-sm font-semibold text-gray-600">
                            {rating.points}{" "}
                            <span className="font-light text-gray-400">
                                ({rating.reviews}件)
                            </span>
                        </div>
                    </Tag>
                </div>

                {/* metadata section */}
                <div className="flex flex-wrap justify-start space-x-4 space-y-1">
                    <Tag
                        Icon={UserGroupIcon}
                        iconStyle="text-gray-300"
                        textStyle="text-sm text-gray-500"
                    >{`〜${maximumCapacity}人`}</Tag>
                    <Tag
                        Icon={HomeIcon}
                        iconStyle="text-gray-300"
                        textStyle="text-sm text-gray-500"
                    >
                        {spaceSize}m²
                    </Tag>
                    <Tag
                        Icon={TagIcon}
                        iconStyle="text-gray-300"
                        textStyle="text-sm text-gray-500"
                    >
                        {spaceType.title}
                    </Tag>
                    <Tag
                        Icon={LocationMarkerIcon}
                        iconStyle="text-gray-300"
                        numberOfLines={1}
                        textStyle="text-sm text-gray-500"
                    >
                        {location}
                    </Tag>
                </div>

                {/* action section */}
                <div className="flex justify-center w-full pt-2 space-x-4 sm:w-60">
                    <Button
                        variant="primary"
                        onClick={() => router.push(`/space/${id}`)}
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
