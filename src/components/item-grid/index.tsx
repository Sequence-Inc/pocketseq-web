import React from 'react';
import Image from 'next/image';
import { LocationMarkerIcon, StarIcon, TagIcon, UserGroupIcon, HomeIcon, HeartIcon } from '@heroicons/react/solid';
import Button from 'element/button';

export interface IItemGrid {
    location: string,
    rating: number,
    cases: number,
    title: string,
    price: number,
    people: number,
    area: string,
    tag: string
}

export interface ItemGridProps {
    data: IItemGrid
}

const ItemGrid = ({ data }: ItemGridProps) => {
    return (
        <div className="px-2 pt-2 pb-3 bg-white max-w-xxs rounded-xl">
            <div className="w-full overflow-hidden rounded-lg aspect-w-10 aspect-h-7">
                <Image
                    src="/itemGrid.svg"
                    alt="category items"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                />
            </div>
            <div>

                {/* location and rating section */}
                <div className="flex justify-between my-1.5">
                    <div className="flex">
                        <LocationMarkerIcon className="h-4 w-4 text-gray-300 mr-0.5" />
                        <p className="text-xs text-gray-500">{data?.location}</p>
                    </div>
                    <div className="flex">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-0.5" />
                        <p className="text-gray-600">
                            <span className='font-bold'>{data?.rating}</span><span> ({data?.cases}件)</span>
                        </p>
                    </div>
                </div>

                {/* title section */}
                <h5 className="text-800 line-clamp-2">{data?.title}</h5>

                {/* price section */}
                <div className="my-3">
                    <h3 className="inline-block text-xl font-bold text-700">¥{data?.price}〜</h3>
                    <span className="text-gray-400">/時間</span>
                </div>

                {/* metadata section */}
                <div className="flex justify-between mb-1.5">
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
                </div>

                {/* action section */}
                <div className="flex justify-between my-2">
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

export default ItemGrid;
