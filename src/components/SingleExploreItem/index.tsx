import React from 'react';
import Image from 'next/image';

export const SingleExploreItem = () => {
    return (
        <div className="grid grid-cols-2">
            <div className="relative w-full overflow-hidden aspect-w-16 aspect-h-9 rounded-2xl">
                <Image
                    src="/explore.svg"
                    alt="category items"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                />
            </div>
            <div className="px-4 py-3">
                <p className="mb-1.5 text-gray-800">新宿</p>
                <p className="text-xs text-gray-500">3.5 km</p>
            </div>
        </div>
    )
}
