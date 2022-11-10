import React, { useEffect, useState } from "react";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/solid";
import { Tag } from "@element";
import { PriceFormatter, recommendationHelper } from "src/utils";
import { SearchResult } from "../GridViewSearch";

export interface RecommendationGridProps {
    type: "HOTEL" | "SPACE";
    title: string;
    logic: any;
    parentId: string;
}

const renderPax = (type, maxAdult, maxChild) => {
    if (type === "hotel") {
        return `ゲスト${maxAdult + maxChild}名`;
    } else {
        if (maxChild === 0) {
            return `大人${maxAdult}名`;
        } else {
            return `大人${maxAdult}名・子供${maxChild}名`;
        }
    }
};

const prepareSearchResult = (
    type: "hotel" | "space",
    results
): SearchResult[] => {
    return results.map((result: any): SearchResult => {
        if (type === "space") {
            let max = 9999999999;
            let min = 0;
            let spaceType = "HOURLY";
            let duration = 1;

            result.price.map((price) => {
                if (max > price.amount && price.amount >= min) {
                    max = price.amount;
                    spaceType = price.type;
                    duration = price.duration;
                }
            });

            let priceUnit: "泊" | "日" | "時間" | "分" | string;

            if (spaceType === "DAILY") {
                priceUnit = "日";
            } else if (spaceType === "HOURLY") {
                priceUnit = "時間";
            } else {
                priceUnit = "分";
            }

            if (duration > 1) {
                priceUnit = duration + priceUnit;
            }

            return {
                id: result.objectID,
                name: result.name,
                maxAdult: result.maximumCapacity,
                maxChild: 0,
                price: max,
                priceUnit,
                lat: result._geoloc?.lat,
                lng: result._geoloc?.lng,
                thumbnail: result.thumbnail,
                type,
            };
        } else {
            return {
                id: result.objectID,
                name: result.name,
                maxAdult: result.maxAdult,
                maxChild: result.maxChild,
                price: result.lowestPrice,
                priceUnit: "泊",
                lat: result._geoloc?.lat,
                lng: result._geoloc?.lng,
                thumbnail: result.thumbnail,
                type,
            };
        }
    });
};

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

    let content = <span>Loading...</span>;

    if (!loading) {
        if (data.length === 0) {
            content = <span>No space available!</span>;
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
