import React from "react";

export interface IReviewComment {
    name: string;
    date: string;
    comment: string;
    thumbnail: string;
}

export const SingleReview = ({ data }: { data: IReviewComment }) => {
    return (
        <div className="pr-4 my-3">
            <div className="flex items-center mb-2 space-x-3">
                <img
                    className="w-12 h-12 rounded-full"
                    src={data?.thumbnail}
                    alt={data?.name}
                />
                <div>
                    <p className="text-gray-800">{data?.name}</p>
                    <p className="text-xs text-gray-500">{data?.date}</p>
                </div>
            </div>
            <div className="text-sm text-gray-600">{data?.comment}</div>
        </div>
    );
};
