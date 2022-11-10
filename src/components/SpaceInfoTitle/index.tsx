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
            <h2 className="mb-3 text-xl font-medium text-gray-700">{name}</h2>
            <div className="flex flex-col space-y-2 md:space-x-3 md:space-y-0 md:items-center md:flex-row">
                <div className="flex space-x-3">
                    <Rating />
                    <div className="text-sm">
                        <span className="inline-block font-bold text-gray-600">
                            {rating.points}
                        </span>
                        <span className="text-gray-500">
                            ({rating.reviews}件)
                        </span>
                    </div>
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
                <Tag
                    Icon={LocationMarkerIcon}
                    iconStyle="text-gray-300"
                    textStyle="text-sm text-gray-500"
                    numberOfLines={1}
                >
                    {location}
                </Tag>
            </div>
        </>
    );
};
