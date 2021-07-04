import React from "react";
import Image from "next/image";

export interface IReviewComment{
    name: string;
    date: string;
    comment: string;
}

export const SingleReview = ({data}: { data: IReviewComment }) => {
    return (
        <div>
            <div className="flex items-center space-x-3 mb-2">
                <Image
                    className="rounded-full"
                    src="/user.svg"
                    width="48"
                    height="48"
                />
                <div>
                    <p className="text-gray-800">{data?.name}</p>
                    <p className="text-gray-500 text-xs">{data?.date}</p>
                </div>
            </div>
            <div className="text-sm text-gray-600">
                {data?.comment}
            </div>
        </div>
    )
}