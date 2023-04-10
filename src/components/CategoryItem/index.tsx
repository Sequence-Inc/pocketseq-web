import React from "react";
import Link from "next/link";

export interface ICategoryItem {
    title: string;
    subTitle: string;
    photo: string;
}

export const CategoryItem = ({ title, subTitle, photo }: ICategoryItem) => {
    return (
        <Link
            href={{
                pathname: `/search`,
                query: {
                    searchType: "space",
                    spaceType: title,
                    searchTitle: title,
                    searchDescription: subTitle,
                },
            }}
        >
            <a>
                <div className="group relative overflow-hidden rounded-lg aspect-w-16 aspect-h-9">
                    {photo && (
                        <img
                            src={photo}
                            alt="category items"
                            className="object-cover w-full h-full"
                        />
                    )}
                    <div className="flex flex-col justify-end p-3 bg-green-700 bg-opacity-25 text-gray-50 group-hover:bg-opacity-5">
                        <h4 className="text-gray-100">{title}</h4>
                        <span className="text-xs hidden group-hover:block">
                            {subTitle}
                        </span>
                    </div>
                </div>
            </a>
        </Link>
    );
};
