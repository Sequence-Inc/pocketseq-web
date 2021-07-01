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
import { ItemGridProps } from "@comp";
import { Button, Price, Tag, Title } from "@element";

export const SingleListItem = ({ data }: ItemGridProps) => {
    return (
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            <div className="w-full overflow-hidden rounded-lg sm:w-60 sm:h-40 aspect-w-16 aspect-h-9 sm:aspect-h-1">
                <Image
                    src="/listItem.svg"
                    alt="category items"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                />
            </div>
            <div className="px-2 space-y-2 sm:px-0">
                <Title>{data?.title}</Title>
                {/* price section */}
                <div className="flex items-end space-x-4">
                    <Price amount={1386} />
                    <Tag Icon={StarIcon} IconStyle="h-5 w-5 text-yellow-400">
                        <div className="text-sm font-semibold text-gray-600">
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
                <div className="flex justify-center w-full py-2 space-x-4 sm:w-60">
                    <Button variant="primary">もっと見る</Button>
                    <Button>
                        <HeartIcon className="inline-block w-4 h-4 mr-1 text-gray-300" />
                        <span>保存</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};
