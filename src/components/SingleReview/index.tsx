import React from "react";
import Image from "next/image";

export interface IReviewComment {
    name: string;
    date: string;
    comment: string;
}

export const SingleReview = ({ data }: { data: IReviewComment }) => {
    return (
        <div>
            <div className="flex items-center mb-2 space-x-3">
                <Image
                    className="rounded-full"
                    src="/user.svg"
                    width="48"
                    height="48"
                />
                <div>
                    <p className="text-gray-800">{data?.name}</p>
                    <p className="text-xs text-gray-500">{data?.date}</p>
                </div>
            </div>
            <div className="text-sm text-gray-600">
                {data?.comment}
            </div>
        </div>
    )
}