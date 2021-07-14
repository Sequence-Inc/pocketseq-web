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

// export const SingleListItem = ({ data }: ItemGridProps) => {
export const SingleListItem = ({ data, activeIndex, setActiveIndex }: any) => {
    return (
        <div
            className={`flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 ${activeIndex === data?.id ? 'bg-gray-100' : ''}`}
            onMouseEnter={() => setActiveIndex && setActiveIndex(data?.id)}
            onMouseLeave={() => setActiveIndex && setActiveIndex(-1)}
        >
            <div className="w-full overflow-hidden rounded-lg sm:w-60 sm:h-40 aspect-w-16 aspect-h-9 sm:aspect-h-1">
                {/* <img
                    src="/listItem.svg"
                    alt="category items"
                    className="object-cover w-full h-full"
                /> */}
                <Image
                    src={data?.photo}
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
                    <Tag
                        Icon={StarIcon}
                        iconSize={5}
                        iconStyle="text-yellow-400"
                    >
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
                    <Tag
                        Icon={UserGroupIcon}
                        iconStyle="text-gray-300"
                        textStyle="text-sm text-gray-500"
                    >{`〜${data?.people}人`}</Tag>
                    <Tag
                        Icon={HomeIcon}
                        iconStyle="text-gray-300"
                        textStyle="text-sm text-gray-500"
                    >
                        {data?.area}
                    </Tag>
                    <Tag
                        Icon={TagIcon}
                        iconStyle="text-gray-300"
                        textStyle="text-sm text-gray-500"
                    >
                        {data?.tag}
                    </Tag>
                    <Tag
                        Icon={LocationMarkerIcon}
                        iconStyle="text-gray-300"
                        numberOfLines={1}
                        textStyle="text-sm text-gray-500"
                    >
                        {data?.location}
                    </Tag>
                </div>

                {/* action section */}
                <div className="flex justify-center w-full py-2 space-x-4 sm:w-60">
                    <Button variant="primary" onClick={() => router.push(`/space/${data?.id}`)}>もっと見る</Button>
                    <Button>
                        <HeartIcon className="inline-block w-4 h-4 mr-1 text-gray-300" />
                        <span>保存</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};
