import { Rating, Tag } from "@element";
import {
    HomeIcon,
    LocationMarkerIcon,
    TagIcon,
} from "@heroicons/react/outline";
import UserGroupIcon from "@heroicons/react/outline/UserGroupIcon";
import Link from "next/link";
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
            <h2 className="mb-3 text-xl font-bold text-gray-700">{name}</h2>
            <div className="flex flex-col space-y-2 sm:space-x-3 sm:space-y-0 sm:items-center sm:flex-row">
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
                    Icon={LocationMarkerIcon}
                    iconStyle="text-gray-300"
                    textStyle="text-sm text-gray-500"
                    numberOfLines={1}
                >
                    {location}
                </Tag>
            </div>
            <div className="w-full mt-4 flex flex-col space-y-2 md:space-x-4 md:space-y-0 md:items-center md:flex-row">
                {spaceTypes.map(({ title, description }, index) => (
                    <Tag
                        key={index}
                        Icon={TagIcon}
                        iconStyle="text-gray-400"
                        numberOfLines={1}
                    >
                        <Link
                            href={{
                                pathname: `/search`,
                                query: {
                                    searchType: "space",
                                    spaceType: title,
                                    searchTitle: title,
                                    searchDescription: description,
                                },
                            }}
                        >
                            <a className="text-sm text-gray-500 hover:text-gray-700">
                                {title}
                            </a>
                        </Link>
                    </Tag>
                ))}
            </div>
        </>
    );
};
