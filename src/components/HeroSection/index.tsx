import React from "react";
import clsx from "clsx";
import { Container } from "@element";
import { SearchBox } from "@comp";

export const HeroSection = () => {
    return (
        <div
            className={clsx(
                "bg-gray-100 relative w-full mt-16 md:mt-0 aspect-w-1 aspect-h-1",
                "sm:aspect-w-4 sm:aspect-h-3 lg:aspect-w-16 lg:aspect-h-8 xl:aspect-w-13 xl:aspect-h-5"
            )}
        >
            <img
                src="/hero-bg.jpg"
                alt="category items"
                role="presentation"
                className="z-0 object-left-topw-full h-full object-cover"
            />
            <Container className="absolute top-0 left-0 z-10 md:pt-16">
                <div className="flex flex-col items-center justify-center w-full h-full lg:items-start lg:w-7/12 xl:w-1/2">
                    <p className="mb-5 text-2xl text-center text-white sm:text-4xl lg:text-left">
                        貸切のレンタルスペースで"やってみたい"を叶えよう
                    </p>
                    <p className="mb-12 text-center text-white text-md sm:text-xl lg:text-left">
                        15,287件のスペースから、目的に合ったスペースがすぐ見つかる
                    </p>
                    <SearchBox />
                </div>
            </Container>
        </div>
    );
};
