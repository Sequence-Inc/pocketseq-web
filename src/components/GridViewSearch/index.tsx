import Link from "next/link";
import React from "react";
import { ItemGrid } from "../ItemGrid";

export type SearchResult = {
    id: string;
    name: string;
    price: number;
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
}: {
    lists: SearchResult[];
    activeIndex: string | number;
    setActiveIndex: any;
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
                ({ id, thumbnail, name, type, price, maxAdult, maxChild }) => {
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
                                    <a>
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
                                    <a className="hover:text-gray-900">
                                        {name}
                                    </a>
                                </Link>
                            </h3>
                            <div className="line-clamp-1 text-base text-gray-600">
                                {pax}
                            </div>
                            <div className="text-xl font-bold">
                                {price}〜
                                <span className="font-normal">
                                    {" "}
                                    /{type === "hotel" ? "泊" : "時間"}
                                </span>
                            </div>
                        </div>
                    );
                }
            )}
        </div>
    );
};
