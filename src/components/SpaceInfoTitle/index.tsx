import { Rating, Tag } from "@element";
import {
    HomeIcon,
    LocationMarkerIcon,
    TagIcon,
} from "@heroicons/react/outline";
import UserGroupIcon from "@heroicons/react/outline/UserGroupIcon";
import React from "react";
import { IAddress, IRating, ISpace, ISpaceType } from "src/types/timebookTypes";
import { FormatShortAddress } from "src/utils";

export interface ISpaceInfoTitleProps {
    name: string;
    maximumCapacity: number;
    spaceSize: number;
    spaceTypes: ISpaceType[];
    rating: IRating;
    location: string;
}

export const SpaceInfoTitle = ({
    titleInfo,
}: {
    titleInfo: ISpaceInfoTitleProps;
}) => {
    const { name, maximumCapacity, spaceSize, spaceTypes, rating, location } =
        titleInfo;
    return (
        <>
            <div className="mb-3">
                <Tag
                    Icon={LocationMarkerIcon}
                    iconStyle="text-gray-300"
                    textStyle="text-sm text-gray-500"
                    numberOfLines={1}
                >
                    {location}
                </Tag>
            </div>
            <h2 className="mb-3 text-xl font-medium text-gray-700">{name}</h2>
            <div className="flex items-center space-x-3">
                <Rating />
                <div className="text-sm">
                    <p className="inline-block font-bold text-gray-600">
                        {rating.points}
                    </p>
                    <span className="text-gray-500">({rating.reviews}件)</span>
                </div>
                <Tag
                    Icon={UserGroupIcon}
                    iconStyle="text-gray-400"
                    textStyle="text-sm text-gray-500"
                    numberOfLines={1}
                >
                    〜{maximumCapacity}人
                </Tag>

                <Tag
                    Icon={HomeIcon}
                    iconStyle="text-gray-400"
                    textStyle="text-sm text-gray-500"
                    numberOfLines={1}
                >
                    {spaceSize}m²
                </Tag>

                <Tag
                    Icon={TagIcon}
                    iconStyle="text-gray-400"
                    textStyle="text-sm text-gray-500"
                    numberOfLines={1}
                >
                    {spaceTypes[0].title}
                </Tag>
            </div>
        </>
    );
};
