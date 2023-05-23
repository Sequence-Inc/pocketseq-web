import React from "react";
import clsx from "clsx";
import Image from "next/image";
import { Container } from "@element";
import { SearchBoxNew } from "@comp";
import { InstantSearch } from "react-instantsearch-dom";
import algoliasearch from "algoliasearch";
import { useRouter } from "next/router";

const searchClient = algoliasearch(
    "latency",
    "6be0576ff61c053d5f9a3225e2a90f76"
);

const createURL = (state) => {
    const queryParams = new URLSearchParams(state);
    `?${queryParams.toString()}`;
};

const searchStateToUrl = (location, searchState) =>
    searchState ? `/search${createURL(searchState)}` : "";

export const HeroSection = () => {
    const router = useRouter();
    const setStateId = React.useRef(null);

    function onSearchStateChange(nextSearchState) {
        clearTimeout(setStateId.current);

        setStateId.current = setTimeout(() => {
            router.push(searchStateToUrl(location, nextSearchState));
        }, 400);
    }

    return (
        <InstantSearch
            searchClient={searchClient}
            indexName="instant_search"
            onSearchStateChange={onSearchStateChange}
        >
            <div
                className={clsx(
                    " relative w-full mt-16 bg-primary",
                    "lg:aspect-w-16 lg:aspect-h-8 xl:aspect-w-13 xl:aspect-h-5"
                )}
            >
                <img
                    src="/images/hero-02.jpg"
                    alt="timeQonnect"
                    role="presentation"
                    className="absolute top-0 left-0 opacity-90 md:opacity-100 md:block z-0 object-cover md:object-center w-full h-full"
                />

                <Container className="z-10 py-6 md:py-0">
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        <div className="z-20 mb-5 md:mb-10 text-3xl font-bold text-center text-white md:text-4xl drop-shadow-md">
                            「人×場所×体験」を繋げる
                            <br className="hidden md:block" />
                            目的に合った場所を検索しよう
                        </div>
                        <SearchBoxNew type="primary" />

                        <div className="z-20 mt-5 md:mt-10 text-center text-white text-xl drop-shadow-md">
                            <span className="font-bold">
                                スタートアップ特集テーマ！
                            </span>
                            <br />
                            ペットと「食べる、泊まる、遊ぶ」　癒しの時間と場所を繋ぐ
                        </div>
                    </div>
                </Container>
            </div>
        </InstantSearch>
    );
};
