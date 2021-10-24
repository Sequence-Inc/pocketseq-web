import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface ICategoryItem {
    title: string;
    subTitle: string;
    photo: string;
}

export const CategoryItem = ({ title, subTitle, photo }: ICategoryItem) => {
    console.log(photo);
    return (
        <Link href="/search">
            <a>
                <div className="relative overflow-hidden rounded-lg aspect-w-16 aspect-h-9">
                    {photo && (
                        <Image
                            layout="fill"
                            src={photo}
                            alt="category items"
                            className="object-cover w-full h-full"
                        />
                    )}
                    <div className="flex flex-col justify-end p-3 bg-green-700 bg-opacity-25 text-gray-50 hover:bg-opacity-50">
                        <h4>{title}</h4>
                        <span className="text-xs">{subTitle}</span>
                    </div>
                </div>
            </a>
        </Link>
    );
};
