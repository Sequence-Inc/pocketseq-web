import { GridViewSearch, ListViewSearch, SearchBox } from "@comp";
import { Alert, GoogleMap, Pagination, Pill, Select } from "@element";
import {
    LightBulbIcon,
    SpeakerphoneIcon,
    ViewGridAddIcon,
    ViewListIcon,
} from "@heroicons/react/outline";
import { MainLayout } from "@layout";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { itemGridData } from "../main";
import qs from 'qs';
import {
    InstantSearch
} from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch';
import { useRouter } from "next/router";

const DEBOUNCE_TIME = 400;
const searchClient = algoliasearch(
    'latency',
    '6be0576ff61c053d5f9a3225e2a90f76'
);

const createURL = (state) => `?${qs.stringify(state)}`;

const searchStateToUrl = (location, searchState) =>
    searchState ? `${location.pathname}${createURL(searchState)}` : '';

const urlToSearchState = (router) => {
    const parsedQuery = qs.parse(router?.query);
    console.log(parsedQuery);
    return parsedQuery
};

const Search = () => {
    const [filter, setFilter] = useState<string>("おすすめ");
    const [sort, setSort] = useState<"list" | "grid">("list");
    const [page, setPage] = useState<number>(1);
    const [activeIndex, setActiveIndex] = useState<string | number>(-1);
    const router = useRouter();
    const [searchState, setSearchState] = React.useState(
        urlToSearchState(router)
    );
    const setStateId = React.useRef(null);

    React.useEffect(() => {
        const nextSearchState = urlToSearchState(router);
        if (JSON.stringify(searchState) !== JSON.stringify(nextSearchState)) {
            setSearchState(nextSearchState);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    function onSearchStateChange(nextSearchState) {
        clearTimeout(setStateId.current);
        console.log(searchStateToUrl(location, nextSearchState),
            nextSearchState)

        setStateId.current = setTimeout(() => {
            router.push(
                searchStateToUrl(location, nextSearchState)
            );
        }, DEBOUNCE_TIME);

        setSearchState(nextSearchState);
    }

    return (
        <MainLayout>
            <Head>
                <title>Search | Timebook</title>
            </Head>
            <InstantSearch
                searchClient={searchClient}
                indexName="instant_search"
                searchState={searchState}
                onSearchStateChange={onSearchStateChange}
                createURL={createURL}
            >
                <div className="relative grid grid-cols-1 lg:grid-cols-9">
                    <div className="px-6 py-10 mt-16 lg:col-span-5">
                        <div className="flex justify-center">
                            <SearchBox attribute="space" />
                        </div>
                        <div className="pt-10">
                            <p className="text-gray-500">300+ 件</p>
                            <h1 className="mb-6 text-3xl font-bold text-gray-700">
                                新宿駅近くのレンタルスペース
                            </h1>
                            <div className="space-y-8">
                                <div className="space-x-2">
                                    <Pill>料金</Pill>
                                    <Pill>会場タイプ</Pill>
                                    <Pill>人数</Pill>
                                    <Pill>詳細条件</Pill>
                                </div>

                                {/* alert section */}
                                <div className="space-y-4">
                                    <Alert Icon={SpeakerphoneIcon}>
                                        <p>
                                            We are currently suspending all new
                                            bookings for the Go To Travel Campaign.
                                            We will update the details on our FAQ
                                            page as needed.
                                            <Link href="/">
                                                <a className="font-medium">
                                                    {" "}
                                                    Go To Travel Campaign FAQ
                                                </a>
                                            </Link>
                                        </p>
                                    </Alert>
                                    <Alert Icon={LightBulbIcon}>
                                        <p className="font-medium">
                                            正確な料金を表示するために
                                        </p>
                                        <p className="text-sm">
                                            利用日と時間を設定すると、正確な合計金額が表示されます。
                                        </p>
                                    </Alert>
                                </div>

                                {/* view changer button */}
                                <div className="flex justify-between">
                                    <div className="flex border border-gray-200 rounded-md">
                                        <button
                                            className="p-2.5 border-r border-gray-200 focus:outline-none"
                                            onClick={() => {
                                                setSort("list");
                                            }}
                                        >
                                            <ViewListIcon className="w-5 h-5 text-gray-400" />
                                        </button>
                                        <button
                                            className="p-2.5"
                                            onClick={() => {
                                                setSort("grid");
                                            }}
                                        >
                                            <ViewGridAddIcon className="w-5 h-5 text-gray-400 focus:outline-none" />
                                        </button>
                                    </div>
                                    <div className="w-32">
                                        <Select
                                            options={["おすすめ", "New"]}
                                            value={filter}
                                            onChange={(selected: string) =>
                                                setFilter(selected)
                                            }
                                        />
                                    </div>
                                </div>

                                {/* lists section */}
                                <div>
                                    {sort === "list" ? (
                                        <div className="divide-y divide-gray-100">
                                            <ListViewSearch
                                                lists={itemGridData}
                                                activeIndex={activeIndex}
                                                setActiveIndex={setActiveIndex}
                                            />
                                        </div>
                                    ) : sort === "grid" ? (
                                        <GridViewSearch
                                            lists={itemGridData}
                                            activeIndex={activeIndex}
                                            setActiveIndex={setActiveIndex}
                                        />
                                    ) : null}
                                    <Pagination
                                        currentPage={page}
                                        totalPages={9}
                                        changePage={(pageNumber: number) =>
                                            setPage(pageNumber)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="sticky top-0 right-0 hidden w-full h-screen col-span-4 pt-16 lg:block">
                        <GoogleMap
                            markers={itemGridData}
                            type="multi"
                            activeIndex={activeIndex}
                            setActiveIndex={setActiveIndex}
                        />
                    </div>
                </div>
            </InstantSearch>
        </MainLayout>
    );
};

export default Search;
