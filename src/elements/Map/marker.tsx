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
        <div className="relative">
            <button
                className={clsx(
                    "rounded-full px-3 text-lg font-bold flex justify-center relative",
                    "hover:bg-gray-900 focus:outline-none hover:text-white",
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
                <Link href={`/space/${marker.id}`}>
                    <a
                        ref={wrapperRef}
                        className="absolute z-20 overflow-hidden bg-white rounded-lg bottom-8 -left-8"
                    >
                        <div className="relative w-48 overflow-hidden aspect-w-16 aspect-h-9">
                            <Image src={marker.photo} layout="fill" />
                        </div>
                        <div className="py-2 px-3 space-y-1.5">
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
                            <h3 className="text-lg font-bold leading-4 line-clamp1 text-gray-700">
                                {marker.name}
                            </h3>
                            <div className="text-xl leading-4 font-bold text-gray-700">
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
