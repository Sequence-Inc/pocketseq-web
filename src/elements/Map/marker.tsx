import clsx from "clsx";
import React from "react";
import Image from "next/image";
import { Price, Tag, Title } from "@element";
import { StarIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useRef } from "react";
import useOutsideAlerter from "@hooks/useOutsideAlerter";
import { ILocationMarker } from "src/types/timebookTypes";
import { PriceFormatter } from "src/utils";

interface MyMarkerProps {
    lat: number;
    lng: number;
    marker: ILocationMarker;
    alive: boolean;
    setAlive: (bool: boolean) => void;
    activeIndex: string | number;
    setActiveIndex: (id: string | number) => void;
}

const MyMarker = ({
    marker,
    alive,
    setAlive,
    activeIndex,
    setActiveIndex,
}: MyMarkerProps) => {
    const wrapperRef = useRef();
    useOutsideAlerter(wrapperRef, handleOutsideClick);

    function handleOutsideClick() {
        setActiveIndex(-1);
        setAlive(false);
    }

    const handleClick = () => {
        !alive && setAlive(true);
        setActiveIndex(marker?.id);
    };

    return (
        <div className="">
            <button
                className={clsx(
                    "rounded-full px-3 py-1 text-base font-bold flex justify-center relative shadow-station",
                    "hover:bg-gray-900 focus:outline-none hover:text-white hover:z-50",
                    {
                        "bg-gray-900 text-white": activeIndex === marker.id,
                        "bg-white text-gray-800": activeIndex !== marker.id,
                    }
                )}
                onMouseEnter={handleClick}
            >
                <span className="text-center" title={marker.name}>
                    {`${PriceFormatter(marker.price)}`}
                </span>
            </button>
            {alive && activeIndex === marker.id && (
                <Link href={`/${marker.type}/${marker.id}`}>
                    <a
                        ref={wrapperRef}
                        className="absolute z-20 overflow-hidden bg-white rounded-lg bottom-2 -left-1/2 transform -translate-x-1/4"
                        target="_blank"
                    >
                        <div className="relative w-48 overflow-hidden aspect-w-16 aspect-h-9">
                            <img src={marker.photo} />
                        </div>
                        <div className="py-4 px-3">
                            {/* <Tag
                                Icon={StarIcon}
                                iconSize={4}
                                iconStyle="text-yellow-400 text-xs"
                            >
                                <div className="text-xs font-semibold text-gray-600">
                                    {marker.rating.points}{" "}
                                    <span className="font-light text-gray-400">
                                        ({marker.rating.reviews}件)
                                    </span>
                                </div>
                            </Tag> */}
                            <h3 className="text-sm font-bold leading-4 line-clamp1 text-gray-700">
                                {marker.name}
                            </h3>
                            <div className="mt-4 text-lg leading-4 font-bold text-gray-700">
                                {marker.priceText}
                            </div>
                        </div>
                    </a>
                </Link>
            )}
        </div>
    );
};

export default MyMarker;
