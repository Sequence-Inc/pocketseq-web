import React from 'react';
import Image from 'next/image';
import { LocationMarkerIcon, StarIcon, TagIcon, UserGroupIcon, HomeIcon, HeartIcon } from '@heroicons/react/solid';
import { ItemGridProps } from 'comp/item-grid';
import Button from 'element/button';

const SingleListItem = ({ data }: ItemGridProps) => {
    return (
        <div className="max-w-3xl flex">
            <div className="relative w-80 aspect-w-7 aspect-h-1 rounded-lg overflow-hidden">
                <Image
                    src="/listItem.svg"
                    alt="category items"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                />
            </div>
            <div className="ml-6 py-1">
                <div>
                    <span className="text-gray-800">{data?.title}</span>
                </div>

                {/* price section */}
                <div className="my-2 flex items-end">
                    <h3 className="text-700 text-xl font-bold inline-block">¥{data?.price}〜</h3>
                    <span className="text-gray-400">/時間</span>
                    <div className="flex ml-3">
                        <StarIcon className="h-5 w-5 text-yellow-400 mr-0.5" />
                        <p className="text-gray-600 text-sm"><span className='font-bold'>{data?.rating}</span><span> ({data?.cases}件)</span></p>
                    </div>
                </div>

                {/* metadata section */}
                <div className="flex space-x-3 mb-1.5">
                    <div>
                        <UserGroupIcon className="w-4 h-4 text-gray-300 inline-block" />
                        <span className="text-gray-500 text-xs">〜{data?.people}人</span>
                    </div>
                    <div>
                        <HomeIcon className="w-4 h-4 text-gray-300 inline-block" />
                        <span className="text-gray-500 text-xs">{data?.area}</span>
                    </div>
                    <div>
                        <TagIcon className="w-4 h-4 text-gray-300 inline-block" />
                        <span className="text-gray-500 text-xs">{data?.tag}</span>
                    </div>
                    <div>
                        <LocationMarkerIcon className="w-4 h-4 text-gray-300 inline-block" />
                        <span className="text-gray-500 text-xs">{data?.location}</span>
                    </div>
                </div>

                {/* action section */}
                <div className="flex space-x-3 my-2">
                    <Button>もっと見る</Button>
                    <Button variant="secondary">
                        <span>
                            <HeartIcon className="w-4 h-4 text-gray-300 inline-block" />保存
                        </span>
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default SingleListItem;
