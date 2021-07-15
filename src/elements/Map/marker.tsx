import clsx from "clsx";
import React from "react";
import Image from "next/image";
import { Price, Tag, Title } from "@element";
import { StarIcon } from "@heroicons/react/solid";
import Link from "next/link";

interface MyMarkerProps {
    lat: number;
    lng: number;
    marker: any;
    alive: boolean;
    setAlive: (bool: boolean) => void;
    activeIndex: string | number;
    setActiveIndex: (id: string | number) => void;
}

const MyMarker = ({ marker, alive, setAlive, activeIndex, setActiveIndex }: MyMarkerProps) => {

    const handleClick = () => {
        !alive && setAlive(true);
        setActiveIndex(marker?.id);
    };

    return (
        <div className="relative">
            <button
                className={clsx(
                    "rounded-full px-3 text-lg font-bold flex justify-center relative",
                    "hover:bg-gray-900 focus:outline-none hover:text-white", {
                    "bg-gray-900 text-white": activeIndex === marker?.id,
                    "bg-white text-gray-800": activeIndex !== marker?.id
                })}
                onClick={handleClick}>
                <span className="text-center" title={marker?.title}>
                    {`$${marker?.price}`}
                </span>
            </button>
            {alive && activeIndex === marker?.id &&
                <Link href={`/space/${marker?.id}`}>
                    <a className="absolute z-20 overflow-hidden bg-white rounded-lg bottom-8 -left-8">
                        <div className="relative w-48 overflow-hidden aspect-w-16 aspect-h-9">
                            <Image
                                src={marker?.photo}
                                layout="fill"
                            />
                        </div>
                        <div className='p-1.5 space-y-1.5'>
                            <Tag
                                Icon={StarIcon}
                                iconSize={4}
                                iconStyle="text-yellow-400 text-xs"
                            >
                                <div className="text-xs font-semibold text-gray-600">
                                    {marker?.rating}{" "}
                                    <span className="font-light text-gray-400">
                                        ({marker?.cases}件)
                                    </span>
                                </div>
                            </Tag>
                            <Title numberOfLines={2}>{marker?.title}</Title>
                            <div className="mt-1">
                                <Price amount={1386} />
                            </div>
                        </div>
                    </a>
                </Link>}
        </div>
    );
};

export default MyMarker;