import React from "react";
import {
    LocationMarkerIcon,
    StarIcon,
    TagIcon,
    UserGroupIcon,
    HomeIcon,
} from "@heroicons/react/solid";
import { Price, Tag, Title } from "@element";

export interface IPickUpItem {
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

export interface PickUpItemProps {
    data: IPickUpItem;
}

export const PickUpItem = ({ data }: PickUpItemProps) => {
    return (
        <div className="space-y-4">
            <div className="w-full overflow-hidden rounded-lg aspect-w-16 aspect-h-9">
                <img
                    src={data?.photo}
                    alt={data?.title}
                    className="z-0 object-left-topw-full h-full object-cover"
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
                    >
                        {data?.tag}
                    </Tag>
                </div>
            </div>
        </div>
    );
};
