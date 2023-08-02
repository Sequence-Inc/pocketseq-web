import { LoadingSpinner, SearchResult } from "@comp";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SubscriptionCategoryType } from "src/apollo/queries/subscriptions/core.schema";
import { PriceFormatter, searchHotel, searchSpace } from "src/utils";

interface SubscriptionItemsListProps {
    type: "hotel" | "space";
    category: SubscriptionCategoryType;
    numbers?: number;
}

export const SubscriptionItemsList = ({
    type,
    category,
    numbers,
}: SubscriptionItemsListProps) => {
    const [items, setItems] = useState([]);
    const [loadComplete, setLoadComplete] = useState(false);
    useEffect(() => {
        const filters = { subscriptionRank: category };
        setLoadComplete(false);
        if (type === "space") {
            searchSpace("", filters, 4)
                .then((data) => {
                    if (data.nbHits > 0) {
                        setItems(prepareSearchResult(type, data.hits));
                    } else {
                        setItems([]);
                    }
                })
                .finally(() => {
                    setLoadComplete(true);
                });
        } else {
            searchHotel("", filters, 4)
                .then((data) => {
                    if (data.nbHits > 0) {
                        setItems(prepareSearchResult(type, data.hits));
                    } else {
                        setItems([]);
                    }
                })
                .finally(() => {
                    setLoadComplete(true);
                });
        }
    }, [category]);

    const prepareSearchResult = (
        type: "hotel" | "space",
        results
    ): SearchResult[] => {
        return results.map((result: any) => {
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

                let priceUnit = "";

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

    if (!loadComplete) {
        return (
            <div id={category} className="text-center font-bold text-lg">
                <LoadingSpinner />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div id={category} className="text-center font-bold text-lg">
                このサブスクリプションカテゴリのアイテムはまだありません。
            </div>
        );
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

    return (
        <div id={category} className={`grid grid-cols-2 sm:grid-cols-4 gap-4`}>
            {items.map(
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
                        <div key={id} className={`space-y-1 rounded-2xl`}>
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
                            {/* <div className="text-xl font-bold">
                                {PriceFormatter(price)}〜
                                <span className="font-normal">{` /${priceUnit}`}</span>
                            </div> */}
                        </div>
                    );
                }
            )}
        </div>
    );
};
