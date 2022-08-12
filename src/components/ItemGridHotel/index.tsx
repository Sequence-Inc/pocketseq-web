import React from "react";
import Link from "next/link";
import {
    LocationMarkerIcon,
    StarIcon,
    HeartIcon,
} from "@heroicons/react/solid";
import { Button, Tag } from "@element";
import router from "next/router";

import { IPhoto } from "../../types/timebookTypes";
import { FormatShortAddress, PriceFormatter } from "src/utils";

export interface ItemGridHotelProps {
    data: any;
    activeIndex?: string | number;
    setActiveIndex?: any;
}

export const ItemGridHotel = ({
    data,
    activeIndex,
    setActiveIndex,
}: ItemGridHotelProps) => {
    const { id, name, description, packagePlans, address, photos } = data;

    const location: string = FormatShortAddress(address);

    const rating = { points: 5, reviews: 1 }; // Todo: implement ratings for each spaces

    const photo: IPhoto = photos[0];

    const getLowestPrice = () => {
        let lowest = 9999999999;
        packagePlans.map((plan) => {
            const selector =
                plan.paymentTerms === "PER_PERSON"
                    ? "oneAdultCharge"
                    : "roomCharge";
            plan.roomTypes.map(({ priceSettings }) => {
                priceSettings.map(({ priceScheme }) => {
                    if (priceScheme[selector] < lowest) {
                        lowest = priceScheme[selector];
                    }
                });
            });
        });
        return lowest;
    };

    return (
        <div
            className={`p-2 space-y-4 bg-white rounded-2xl ${
                activeIndex === id ? "bg-gray-100" : ""
            }`}
            onMouseEnter={() => setActiveIndex && setActiveIndex(data?.id)}
            onMouseLeave={() => setActiveIndex && setActiveIndex(-1)}
        >
            <div className="w-full overflow-hidden rounded-lg aspect-w-16 aspect-h-9 z-0">
                <img
                    src={photo.medium?.url}
                    alt={name}
                    className="object-cover object-left-top w-full h-full z-0"
                />
            </div>
            <div className="px-2 space-y-2">
                {/* location and rating section */}
                <div className="flex items-center justify-between">
                    <Tag
                        Icon={LocationMarkerIcon}
                        iconStyle="text-gray-300"
                        textStyle="text-sm text-gray-500"
                        numberOfLines={1}
                    >
                        {location}
                    </Tag>

                    <Tag Icon={StarIcon} iconStyle="h-5 w-5 text-yellow-400">
                        <div className="text-sm font-semibold text-gray-600">
                            {rating.points}{" "}
                            <span className="font-light text-gray-400">
                                ({rating.reviews}件)
                            </span>
                        </div>
                    </Tag>
                </div>
                {/* title section */}
                <Link href={`/hotel/${encodeURIComponent(id)}`}>
                    <a className="block">
                        <h3 className="text-gray-800 line-clamp-1 text-lg font-bold">
                            {name}
                        </h3>
                        <div className="line-clamp-1 text-base text-gray-600">
                            {description}
                        </div>
                    </a>
                </Link>
                {/* price section */}
                <div className="text-xl font-bold">
                    {PriceFormatter(getLowestPrice())}〜
                    <span className="font-normal"> /泊</span>
                </div>
                {/* action section */}
                <div className="flex justify-between py-2 space-x-4">
                    <Button
                        variant="primary"
                        onClick={() => router.push(`/hotel/${id}`)}
                    >
                        もっと見る
                    </Button>
                    <Button>
                        <HeartIcon className="inline-block w-4 h-4 mr-1 text-gray-300" />
                        <span>保存</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};
