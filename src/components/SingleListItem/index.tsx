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
import { ItemGridProps } from "@comp/index";
import { Button, Price, Tag, Title } from "@element/index";

export const SingleListItem = ({ data }: ItemGridProps) => {
    return (
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-full sm:w-60 sm:h-40 aspect-w-16 aspect-h-9 sm:aspect-h-1 rounded-lg overflow-hidden">
                <Image
                    src="/listItem.svg"
                    alt="category items"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                />
            </div>
            <div className="space-y-2 px-2 sm:px-0">
                <Title>{data?.title}</Title>
                {/* price section */}
                <div className="flex items-end space-x-4">
                    <Price amount={1386} />
                    <Tag Icon={StarIcon} IconStyle="h-5 w-5 text-yellow-400">
                        <div className="text-gray-600 text-sm font-semibold">
                            {data?.rating}{" "}
                            <span className="font-light text-gray-400">
                                ({data?.cases}件)
                            </span>
                        </div>
                    </Tag>
                </div>

                {/* metadata section */}
                <div className="flex flex-wrap justify-start space-x-4 space-y-1">
                    <Tag Icon={UserGroupIcon}>{`〜${data?.people}人`}</Tag>
                    <Tag Icon={HomeIcon}>{data?.area}</Tag>
                    <Tag Icon={TagIcon}>{data?.tag}</Tag>
                    <Tag Icon={LocationMarkerIcon} numberOfLines={1}>
                        {data?.location}
                    </Tag>
                </div>

                {/* action section */}
                <div className="w-full sm:w-60 flex justify-center py-2 space-x-4">
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
