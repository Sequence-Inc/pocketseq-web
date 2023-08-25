import React, { useEffect, useState } from "react";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/solid";
import { Tag } from "@element";
import {
    prepareSearchResult,
    PriceFormatter,
    recommendationHelper,
    renderPax,
} from "src/utils";
import { SearchResult } from "../GridViewSearch";
import { LoadingSpinner } from "../LoadingSpinner";

export interface RecommendationGridProps {
    type: "HOTEL" | "SPACE";
    title: string;
    logic: any;
    parentId: string;
}

export const RecommendationGrid = ({
    type,
    title,
    logic,
    parentId,
}: RecommendationGridProps) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<SearchResult[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const data = await recommendationHelper(type, logic);
                const preparedData = prepareSearchResult(
                    type === "SPACE" ? "space" : "hotel",
                    data.hits
                ).filter((a) => a.id !== parentId);

                setData([...preparedData]);
                setLoading(false);
            } catch (error) {
                console.log("Err", error.message);
                setLoading(false);
            }
        })();
    }, []);

    let content = <LoadingSpinner />;

    if (!loading) {
        if (data.length === 0) {
            content = <div>No space available!</div>;
        } else {
            content = (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-4">
                    {data.map(
                        (
                            {
                                id,
                                thumbnail,
                                name,
                                type,
                                price,
                                priceUnit,
                                maxAdult,
                                maxChild,
                            },
                            index
                        ) => {
                            // Only display 4
                            if (index > 3) return null;

                            const link = `/` + type.toLowerCase() + `/${id}`;
                            const pax = renderPax(type, maxAdult, maxChild);
                            return (
                                <div
                                    key={id}
                                    className={`space-y-1 mb-3 rounded-2xl`}
                                >
                                    <div
                                        className="relative shadow-sm bg-gray-100 rounded-xl overflow-hidden"
                                        style={{ paddingBottom: "100%" }}
                                    >
                                        <Link href={link}>
                                            <a target="_blank">
                                                {" "}
                                                <img
                                                    src={thumbnail}
                                                    className="absolute top-0 w-full h-full object-cover"
                                                />
                                            </a>
                                        </Link>
                                    </div>
                                    <h3 className="text-gray-800 line-clamp-1 text-lg font-bold pt-2">
                                        <Link href={link}>
                                            <a
                                                target="_blank"
                                                className="text-gray-700 hover:text-gray-900"
                                            >
                                                {name}
                                            </a>
                                        </Link>
                                    </h3>
                                    <div className="line-clamp-1 text-base text-gray-600">
                                        {pax}
                                    </div>
                                    <div className="text-xl font-bold">
                                        {PriceFormatter(price)}〜
                                        <span className="font-normal">{` /${priceUnit}`}</span>
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
            );
        }
    }

    return (
        <div className="my-10">
            <div className="flex items-center justify-between px-1 pb-3 mb-6 border-b border-gray-200">
                <Tag
                    Icon={StarIcon}
                    iconSize={6}
                    iconStyle="mr-2 text-primary"
                    textStyle="text-xl text-primary"
                >
                    {title}
                </Tag>
            </div>
            {content}
        </div>
    );
};
