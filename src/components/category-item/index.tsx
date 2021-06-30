import React from 'react';
import Image from 'next/image';

interface CategoryItemProps {
    title: string;
    subTitle: string;
}

const CategoryItem = ({ title, subTitle }: CategoryItemProps) => {
    return (
        <div className="rounded-lg relative aspect-w-16 aspect-h-9 overflow-hidden">
            <Image
                className="-z-1"
                src="/category.svg"
                alt="category items"
                layout="fill"
                role="presentation"
                objectFit="cover"
                objectPosition="center"
            />
            <div className="text-gray-50 flex flex-col justify-end p-3">
                <h4>{title}</h4>
                <p>{subTitle}</p>
            </div>
        </div>
    )
}

export default CategoryItem;
