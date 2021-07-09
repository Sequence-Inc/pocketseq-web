import React from "react";

export interface ICategoryItem {
    title: string;
    subTitle: string;
    photo: string;
}

export const CategoryItem = ({ title, subTitle, photo }: ICategoryItem) => {
    return (
        <div className="rounded-lg relative aspect-w-16 aspect-h-9 overflow-hidden">
            <img
                src={photo}
                alt="category items"
                className="h-full w-full object-cover"
            />
            <div className="text-gray-50 flex flex-col justify-end p-3 bg-green-700 bg-opacity-25 hover:bg-opacity-50">
                <h4>{title}</h4>
                <span className="text-xs">{subTitle}</span>
            </div>
        </div>
    );
};
