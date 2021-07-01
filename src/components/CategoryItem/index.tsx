import React from "react";
import Image from "next/image";

export interface CategoryItemProps {
    title: string;
    subTitle: string;
}

export const CategoryItem = ({ title, subTitle }: CategoryItemProps) => {
    return (
        <div className="rounded-lg relative aspect-w-16 aspect-h-9 overflow-hidden">
            <Image
                src="/category.svg"
                alt="category items"
                layout="fill"
                role="presentation"
                objectFit="cover"
                objectPosition="center"
            />
            <div className="text-gray-50 flex flex-col justify-end p-3 bg-green-700 bg-opacity-25 hover:bg-opacity-50">
                <h4>{title}</h4>
                <p>{subTitle}</p>
            </div>
        </div>
    );
};
