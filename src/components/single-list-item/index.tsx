import React from 'react';
import Image from 'next/image';
import { LocationMarkerIcon, StarIcon, TagIcon, UserGroupIcon, HomeIcon, HeartIcon } from '@heroicons/react/solid';
import { ItemGridProps } from 'comp/item-grid';
import Button from 'element/button';

const SingleListItem = ({ data }: ItemGridProps) => {
    return (
        <div className="flex max-w-3xl">
            <div className="relative overflow-hidden rounded-lg w-80 aspect-w-7 aspect-h-1">
                <Image
                    src="/listItem.svg"
                    alt="category items"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                />
            </div>
            <div className="py-1 ml-6">
                <div>
                    <span className="text-gray-800">{data?.title}</span>
                </div>

                {/* price section */}
                <div className="flex items-end my-2">
                    <h3 className="inline-block text-xl font-bold text-700">¥{data?.price}〜</h3>
                    <span className="text-gray-400">/時間</span>
                    <div className="flex ml-3">
                        <StarIcon className="h-5 w-5 text-yellow-400 mr-0.5" />
                        <p className="text-sm text-gray-600">
                            <span className='font-bold'>{data?.rating}</span><span> ({data?.cases}件)</span>
                        </p>
                    </div>
                </div>

                {/* metadata section */}
                <div className="flex space-x-3 mb-1.5">
                    <div>
                        <UserGroupIcon className="inline-block w-4 h-4 text-gray-300" />
                        <span className="text-xs text-gray-500">〜{data?.people}人</span>
                    </div>
                    <div>
                        <HomeIcon className="inline-block w-4 h-4 text-gray-300" />
                        <span className="text-xs text-gray-500">{data?.area}</span>
                    </div>
                    <div>
                        <TagIcon className="inline-block w-4 h-4 text-gray-300" />
                        <span className="text-xs text-gray-500">{data?.tag}</span>
                    </div>
                    <div>
                        <LocationMarkerIcon className="inline-block w-4 h-4 text-gray-300" />
                        <span className="text-xs text-gray-500">{data?.location}</span>
                    </div>
                </div>

                {/* action section */}
                <div className="flex my-2 space-x-3">
                    <Button>もっと見る</Button>
                    <Button variant="secondary">
                        <span>
                            <HeartIcon className="inline-block w-4 h-4 text-gray-300" />保存
                        </span>
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default SingleListItem;
