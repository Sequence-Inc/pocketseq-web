import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface IExploreItem {
    name: string;
    distance: string;
    photo: string;
}

export const SingleExploreItem = ({ name, distance, photo }: IExploreItem) => {
    return (
        <div className="grid grid-cols-2">
            <div className="relative w-full overflow-hidden aspect-w-16 aspect-h-9 rounded-lg">
                <Link href="/search">
                    <a>
                        <img
                            src={photo}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                    </a>
                </Link>
            </div>
            <div className="px-4 py-3">
                <p className="mb-1 text-gray-800">
                    <Link href="/search">
                        <a>{name}</a>
                    </Link>
                </p>
                <p className="text-xs text-gray-500">{distance}</p>
            </div>
        </div>
    );
};
