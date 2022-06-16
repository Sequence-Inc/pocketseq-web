import React from "react";
import clsx from "clsx";
import Image from "next/image";
import { Container } from "@element";
import { SearchBox } from "@comp";
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

export const HeroSection = ({
    availableSpaceTypes,
}: {
    availableSpaceTypes?: any;
}) => {
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
                    "bg-gray-100 relative w-full mt-16 md:mt-0 aspect-w-1 aspect-h-1",
                    "sm:aspect-w-4 sm:aspect-h-3 lg:aspect-w-16 lg:aspect-h-8 xl:aspect-w-13 xl:aspect-h-5"
                )}
            >
                <Image
                    layout="fill"
                    src="/images/hero-02.jpg"
                    alt="timeQonnect"
                    role="presentation"
                    className="z-0 object-cover object-center w-full h-full"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-primary opacity-0">
                    &nbsp;
                </div>
                <Container className="absolute top-0 left-0 z-10 md:pt-16">
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        <p className="mb-10 text-2xl font-bold text-center text-white sm:text-4xl">
                            「人×場所×体験」を繋げる
                            目的に合った場所を検索しよう
                        </p>
                        <SearchBox
                            onChange={() => {
                                return null;
                            }}
                            availableSpaceTypes={availableSpaceTypes}
                        />

                        <p className="mt-10 text-center text-white text-md sm:text-xl">
                            <span className="font-bold">
                                スタートアップ特集テーマ！
                            </span>
                            <br />
                            ペットと「食べる、泊まる、遊ぶ」　癒しの時間と場所を繋ぐ
                        </p>
                    </div>
                </Container>
            </div>
        </InstantSearch>
    );
};
