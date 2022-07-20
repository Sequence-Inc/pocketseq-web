import { IReviewComment, ReviewItem, SingleReview } from "@comp";
import { StarIcon } from "@heroicons/react/solid";
import Link from "next/link";
import React from "react";

interface IReviews {
    title: string;
    rating: number;
}

const reviewComment: IReviewComment[] = [
    {
        name: "Yusaku",
        date: "2021年6月",
        comment: "立地も良く､清潔感のある宿で満足できるかと思います!",
        thumbnail: "/review.jpg",
    },
    {
        name: "Takayuki",
        date: "2021年5月",
        comment:
            "施設はとても綺麗で､ｷｯﾁﾝやｱﾒﾆﾃｨも充実しています｡ ｿﾌﾄﾊﾞﾝｸ携帯の電波が入らない点が難点でしたが､滞在はとても満足しています｡!",
        thumbnail: "/review.jpg",
    },
    {
        name: "Yusaku",
        date: "2021年5月",
        comment: "部屋もｷﾚｲでとても楽しめました｡!",
        thumbnail: "/review.jpg",
    },
    {
        name: "高橋",
        date: "2021年5月",
        comment:
            "非常に満足です｡ 対応も設備も文句なし｡ 素晴らしい非日常を味わうことができました｡ 何も不自由することなく楽しめましたので 是非利用してみてください｡!",
        thumbnail: "/review.jpg",
    },
];

const reviews: IReviews[] = [
    {
        title: "清潔さ",
        rating: 4.7,
    },
    {
        title: "掲載情報の正確さ",
        rating: 4.8,
    },
    {
        title: "コミュニケーション",
        rating: 5.0,
    },
    {
        title: "ロケーション",
        rating: 4.6,
    },
    {
        title: "チェックイン",
        rating: 4.9,
    },
    {
        title: "価格",
        rating: 4.6,
    },
];

export const SpaceInfoReviews = () => {
    return (
        <div className="pb-20">
            <div className="flex items-center space-x-2">
                <StarIcon className="w-5 h-5 text-red-500" />
                <p className="text-lg font-bold text-gray-700">
                    4.52（99件のレビュー）
                </p>
            </div>
            <div className="grid max-w-3xl grid-cols-1 py-5 space-y-2 sm:grid-cols-2">
                {reviews.map((res, index) => (
                    <ReviewItem
                        key={index}
                        id={`review${index}`}
                        title={res.title}
                        value={res.rating}
                        className="mr-16"
                    />
                ))}
            </div>
            <div className="grid max-w-3xl grid-cols-1 py-4 md:grid-cols-2">
                {reviewComment.map((res, index) => (
                    <SingleReview key={index} data={res} />
                ))}
            </div>
            <div>
                <Link href="/">
                    <a className="px-4 py-2 text-gray-700 bg-white border border-gray-400 rounded-lg font-sm">
                        99件のレビューをすべて表示
                    </a>
                </Link>
            </div>
        </div>
    );
};
