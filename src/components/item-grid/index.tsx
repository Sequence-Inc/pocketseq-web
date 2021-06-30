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
        <div className="max-w-xxs px-2 pt-2 pb-3 bg-white rounded-xl">
            <div className="w-full aspect-w-10 aspect-h-7 rounded-lg overflow-hidden">
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
                        <p className="text-gray-600"><span className='font-bold'>{data?.rating}</span><span> ({data?.cases}件)</span></p>
                    </div>
                </div>

                {/* title section */}
                <h5 className="text-800 line-clamp-2">{data?.title}</h5>

                {/* price section */}
                <div className="my-3">
                    <h3 className="text-700 text-xl font-bold inline-block">¥{data?.price}〜</h3>
                    <span className="text-gray-400">/時間</span>
                </div>

                {/* metadata section */}
                <div className="flex justify-between mb-1.5">
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
                </div>

                {/* action section */}
                <div className="flex justify-between my-2">
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

export default ItemGrid
