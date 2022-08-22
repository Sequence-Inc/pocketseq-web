import React from "react";
import Link from "next/link";

export interface ICategoryItem {
    title: string;
    subTitle: string;
    photo: string;
}

export const CategoryItem = ({ title, subTitle, photo }: ICategoryItem) => {
    return (
        <Link href={`/search?searchType=space&spaceType=${title}`}>
            <a>
                <div className="relative overflow-hidden rounded-lg aspect-w-16 aspect-h-9">
                    {photo && (
                        <img
                            src={photo}
                            alt="category items"
                            className="object-cover w-full h-full"
                        />
                    )}
                    <div className="flex flex-col justify-end p-3 bg-green-700 bg-opacity-25 text-gray-50 hover:bg-opacity-50">
                        <h4 className="text-gray-100">{title}</h4>
                        <span className="text-xs">{subTitle}</span>
                    </div>
                </div>
            </a>
        </Link>
    );
};
