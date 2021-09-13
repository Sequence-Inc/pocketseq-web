import React from "react";
import clsx from "clsx";
import Image from "next/image";
import { Container } from "@element";
import { SearchBox } from "@comp";

export const HeroSection = () => {
    return (
        <div
            className={clsx(
                "bg-gray-100 relative w-full mt-16 md:mt-0 aspect-w-1 aspect-h-1",
                "sm:aspect-w-4 sm:aspect-h-3 lg:aspect-w-16 lg:aspect-h-9"
            )}
        >
            <Image
                layout="fill"
                src="/hero-image.jpg"
                alt="Timebook"
                role="presentation"
                className="z-0 object-bottom w-full h-full object-cover"
            />
            <div className="absolute w-full h-full top-0 left-0 bg-primary opacity-60">
                &nbsp;
            </div>
            <Container className="absolute top-0 left-0 z-10 md:pt-16">
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <p className="mb-10 text-2xl text-center text-white font-bold sm:text-4xl">
                        貸切のレンタルスペースで"やってみたい"を叶えよう
                    </p>
                    <SearchBox />
                    <p className="mt-10 text-center text-white text-md sm:text-xl">
                        15,287件のスペースから、目的に合ったスペースがすぐ見つかる
                    </p>
                </div>
            </Container>
        </div>
    );
};
