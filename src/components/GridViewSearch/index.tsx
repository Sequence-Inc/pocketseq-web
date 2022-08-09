import Link from "next/link";
import React from "react";
import { PriceFormatter } from "src/utils";

export type SpacePricePlan = {
    amount: number;
    duration: number;
    type: "HOURLY" | "DAILY" | "MINUTES";
};
export type SearchResult = {
    id: string;
    name: string;
    price: number;
    priceUnit: "泊" | "日" | "時間" | "5分" | "10分" | "15分" | "30分" | "45分";
    maxAdult: number;
    maxChild?: number;
    thumbnail?: string;
    lat?: number;
    lng?: number;
    type: "hotel" | "space";
};

export const GridViewSearch = ({
    lists,
    activeIndex,
    setActiveIndex,
    minPriceFilter,
}: {
    lists: SearchResult[];
    activeIndex: string | number;
    setActiveIndex: any;
    minPriceFilter?: number;
}) => {
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

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {lists.map(
                ({
                    id,
                    thumbnail,
                    name,
                    type,
                    price,
                    priceUnit,
                    maxAdult,
                    maxChild,
                }) => {
                    const link = `/` + type + `/${id}`;
                    const pax = renderPax(type, maxAdult, maxChild);
                    return (
                        <div
                            key={id}
                            className={`space-y-1 mb-3 p-2 pb-3 rounded-2xl ${
                                activeIndex === id ? "bg-gray-50" : ""
                            }`}
                            onMouseEnter={() =>
                                setActiveIndex && setActiveIndex(id)
                            }
                            onMouseLeave={() =>
                                setActiveIndex && setActiveIndex(-1)
                            }
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
};
