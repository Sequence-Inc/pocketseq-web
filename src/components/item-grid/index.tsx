import React from 'react';
import Image from 'next/image';
import { LocationMarkerIcon, StarIcon, TagIcon, UserGroupIcon, HomeIcon, HeartIcon } from '@heroicons/react/solid';
import Button from 'element/button';

const ItemGrid = () => {
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
                <div className="flex my-1.5">
                    <div className="flex justify-between">
                        <LocationMarkerIcon className="h-4 w-4 text-gray-300 mr-0.5" />
                        <p className="text-xs text-gray-500">東京都目黒区</p>
                    </div>
                    <div className="flex">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-0.5" />
                        <p className="text-gray-600"><span className='font-bold'>4.52</span><span> (99件)</span></p>
                    </div>
                </div>

                {/* title section */}
                <h5 className="text-800 line-clamp-2">OPEN割🎉151_Forever新宿🌿🍑大人気ゲーム機🎮超大型65㌅テレビ📺鍋会・たこパ🐙</h5>

                {/* price section */}
                <div className="my-3">
                    <h3 className="text-700 text-xl font-bold inline-block">¥1,386〜</h3>
                    <span className="text-gray-400">/時間</span>
                </div>

                {/* additional info section */}
                <div className="flex justify-between mb-1.5">
                    <div>
                        <UserGroupIcon className="w-4 h-4 text-gray-300 inline-block" />
                        <span className="text-gray-500 text-xs">〜15人</span>
                    </div>
                    <div>
                        <HomeIcon className="w-4 h-4 text-gray-300 inline-block" />
                        <span className="text-gray-500 text-xs">24m2</span>
                    </div>
                    <div>
                        <TagIcon className="w-4 h-4 text-gray-300 inline-block" />
                        <span className="text-gray-500 text-xs">貸し会議室</span>
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
