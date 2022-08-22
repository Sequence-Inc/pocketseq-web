import React, { useEffect, useState } from "react";
import createApolloClient from "src/apollo/apolloClient";
import { Switch } from "@headlessui/react";
import {
    GridViewSearch,
    LoadingSpinner,
    SearchBoxNew,
    SearchResult,
} from "@comp";
import { Container, GoogleMap } from "@element";
import { AdjustmentsIcon } from "@heroicons/react/outline";
import { MainLayout } from "@layout";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { Slider } from "antd";
import { GET_AVAILABLE_SPACE_TYPES } from "src/apollo/queries/space.queries";
import { ILocationMarker } from "src/types/timebookTypes";
import { config, PriceFormatter, searchHotel, searchSpace } from "src/utils";

type SearchParams = {
    area?: string;
    noOfAdults: number;
    noOfChild: number;
    noOfAdultsMin: number;
    searchType: "hotel" | "space";
    checkInDate: string;
    checkOutDate?: string;
    price?: number;
    minPrice?: number;
    spaceType?: string;
    venueType?: string;
    breakfast?: boolean;
    pet?: boolean;
    buildingType?: string;
    boundingBox?: number[];
};

const Search = ({ userSession, availableSpaceTypes, search }) => {
    const [filter, setFilter] = useState<string>("おすすめ");
    const [sort, setSort] = useState<"grid">("grid");
    const [page, setPage] = useState<number>(1);

    const [showFilter, setShowFilter] = useState<boolean>(false);

    const [activeIndex, setActiveIndex] = useState<string | number>(-1);

    const [searchParams, setSearchParams] = useState(search);

    const [searchDataReceived, setSearchDataReceived] = useState(false);
    const [algoliaSearchResults, setAlgoliaSearchResults] = useState<
        SearchResult[]
    >([]);

    useEffect(() => {
        const type = searchParams?.searchType;
        const area: string = searchParams?.area as string;
        const adult = parseInt(searchParams?.noOfAdults as string, 10);
        const adultMin =
            parseInt(searchParams?.noOfAdultsMin as string, 10) || 0;
        const child = parseInt(searchParams?.noOfChild as string, 10);
        const spaceType = searchParams?.spaceType;
        const price = searchParams?.price;
        const minPrice = searchParams?.minPrice;
        const breakfast = searchParams?.breakfast;
        const pet = searchParams?.pet;
        const buildingType = searchParams?.buildingType;
        const boundingBox = searchParams?.boundingBox;

        if (type === "space") {
            const filters = {};
            if (area) {
                filters["city"] = area;
            }
            if (adult) {
                if (child && child > 0) {
                    filters["max"] = adult + child;
                } else {
                    filters["max"] = adult;
                }
                if (adultMin > 0) {
                    filters["minPax"] = adultMin;
                }
            }
            if (spaceType) {
                filters["spaceType"] = spaceType;
            }
            if (price) {
                filters["price"] = price;
            }
            if (minPrice) {
                filters["minPrice"] = minPrice;
            }
            if (boundingBox) {
                filters["boundingBox"] = boundingBox;
            }
            searchSpace("", filters)
                .then((data) => {
                    if (data.nbHits > 0) {
                        setAlgoliaSearchResults(
                            prepareSearchResult("space", data.hits)
                        );
                    } else {
                        setAlgoliaSearchResults([]);
                    }
                })
                .finally(() => {
                    setSearchDataReceived(true);
                });
        } else {
            const filters = {};
            if (area) {
                filters["city"] = area;
            }
            if (adult) {
                filters["adult"] = adult;
            }
            if (child && child > 0) {
                filters["child"] = child;
            }
            if (pet) {
                filters["pet"] = pet;
            }
            if (breakfast) {
                filters["breakfast"] = breakfast;
            }
            if (buildingType) {
                filters["buildingType"] = buildingType;
            }
            if (boundingBox) {
                filters["boundingBox"] = boundingBox;
            }
            searchHotel("", filters)
                .then((data) => {
                    if (data.nbHits > 0) {
                        setAlgoliaSearchResults(
                            prepareSearchResult("hotel", data.hits)
                        );
                    } else {
                        setAlgoliaSearchResults([]);
                    }
                })
                .finally(() => {
                    setSearchDataReceived(true);
                });
        }
    }, [searchParams]);

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
                if (searchParams.minPrice) {
                    min = searchParams.minPrice - 1;
                }

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

    if (!searchDataReceived) {
        return <LoadingSpinner />;
    }

    const locationMarkers: ILocationMarker[] = algoliaSearchResults.map(
        (result) => {
            const { id, lat, lng, name, price, priceUnit, thumbnail, type } =
                result;
            const priceText = `${PriceFormatter(price)}〜 /${priceUnit}`;

            return {
                id,
                coords: {
                    lat,
                    lng,
                },
                name,
                price,
                priceUnit,
                priceText,
                photo: thumbnail,
                rating: {
                    reviews: 1,
                    points: 5,
                },
            };
        }
    );

    const updateSearchParam = (key, value) => {
        const newParams = { ...searchParams };
        newParams[key] = value;
        setSearchParams(newParams);
    };

    const handleMapChange = (data) => {
        const { ne, sw } = data.marginBounds;
        const boundingBox = [
            ne.lat, // p1Lat
            ne.lng, // p1Lng
            sw.lat, // p2Lat
            sw.lng, // p2Lng
        ];

        updateSearchParam("boundingBox", boundingBox);
    };

    return (
        <MainLayout userSession={userSession}>
            <Head>
                <title>Search | {config.appName}</title>
            </Head>
            <div className="">
                <div className="pt-16 space-y-10 grid grid-cols-1 lg:grid-cols-9">
                    <div className="p-5 col-span-9 lg:col-span-9 bg-gray-100 rounded-md">
                        <div className="">
                            <SearchBoxNew
                                onChange={(data) => {
                                    setSearchParams({
                                        ...searchParams,
                                        ...data,
                                    });
                                }}
                                defaultValue={searchParams}
                                type="secondary"
                            />
                        </div>
                    </div>
                </div>
                <Container className="relative pb-12 gap-10 grid grid-cols-1 lg:grid-cols-9">
                    <div className="pt-8 pb-16 col-span-9 lg:col-span-5">
                        <div>
                            <h1 className="flex items-center justify-between mb-6">
                                <span className="text-3xl font-bold text-gray-700">
                                    {algoliaSearchResults?.length}
                                    件を超える
                                    {searchParams.searchType === "hotel"
                                        ? "宿泊先"
                                        : "スペース"}
                                </span>
                                <button
                                    onClick={() => {
                                        setShowFilter(!showFilter);
                                    }}
                                    className="flex items-center font-bold border border-gray-300 rounded text-gray-600 px-3 py-2 hover:bg-gray-50"
                                >
                                    <AdjustmentsIcon className="w-4 h-4 mr-1" />
                                    フィルタ
                                </button>
                            </h1>
                            <div className="space-y-8">
                                {showFilter && (
                                    <>
                                        {searchParams?.searchType ===
                                            "space" && (
                                            <>
                                                <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                                                    <div className="flex items-center justify-between p-4">
                                                        <span className="text-gray-600 text-base font-bold w-20">
                                                            料金
                                                        </span>
                                                        <div className="w-full">
                                                            <Slider
                                                                range={{
                                                                    draggableTrack:
                                                                        true,
                                                                }}
                                                                defaultValue={[
                                                                    0, 10000,
                                                                ]}
                                                                min={0}
                                                                max={30000}
                                                                step={500}
                                                                tooltipVisible
                                                                onChange={(
                                                                    value
                                                                ) => {
                                                                    console.log(
                                                                        value
                                                                    );

                                                                    setSearchParams(
                                                                        {
                                                                            ...searchParams,
                                                                            minPrice:
                                                                                value[0],
                                                                            price: value[1],
                                                                        }
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between px-4 py-3">
                                                        <span className="text-gray-600 text-base font-bold">
                                                            人数
                                                        </span>
                                                        <select
                                                            className="w-32 px-3 py-1 border border-gray-200 rounded text-gray-600"
                                                            onChange={(
                                                                event
                                                            ) => {
                                                                const [
                                                                    min,
                                                                    max,
                                                                ] =
                                                                    event.target.value.split(
                                                                        ":"
                                                                    );
                                                                setSearchParams(
                                                                    {
                                                                        ...searchParams,
                                                                        noOfAdults:
                                                                            max,
                                                                        noOfAdultsMin:
                                                                            min,
                                                                    }
                                                                );
                                                            }}
                                                        >
                                                            <option value="1:1000">
                                                                指定なし
                                                            </option>
                                                            <option value="1:10">
                                                                1〜10名
                                                            </option>
                                                            <option value="11:15">
                                                                11〜15名
                                                            </option>
                                                            <option value="16:20">
                                                                16〜20名
                                                            </option>
                                                            <option value="21:25">
                                                                21〜25名
                                                            </option>
                                                            <option value="26:30">
                                                                26〜30名
                                                            </option>
                                                            <option value="31:35">
                                                                31〜35名
                                                            </option>
                                                            <option value="36:40">
                                                                36〜40名
                                                            </option>
                                                            <option value="41:1000">
                                                                40名以上
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div className="flex items-center justify-between px-4 py-3">
                                                        <span className="text-gray-600 text-base font-bold">
                                                            利用目的
                                                        </span>
                                                        <select
                                                            className="w-60 px-3 py-1 border border-gray-200 rounded text-gray-600"
                                                            onChange={(
                                                                event
                                                            ) => {
                                                                const {
                                                                    value,
                                                                } =
                                                                    event.target;
                                                                if (
                                                                    value ===
                                                                    "null"
                                                                ) {
                                                                    updateSearchParam(
                                                                        "spaceType",
                                                                        null
                                                                    );
                                                                } else {
                                                                    updateSearchParam(
                                                                        "spaceType",
                                                                        value
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <option value="null"></option>
                                                            {availableSpaceTypes.map(
                                                                (
                                                                    spaceType,
                                                                    index
                                                                ) => {
                                                                    return (
                                                                        <option
                                                                            value={
                                                                                spaceType.title
                                                                            }
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            {
                                                                                spaceType.title
                                                                            }
                                                                        </option>
                                                                    );
                                                                }
                                                            )}
                                                        </select>
                                                    </div>
                                                    <div className="flex items-center justify-between px-4 py-3">
                                                        <span className="text-gray-600 text-base font-bold">
                                                            会場タイプ
                                                        </span>
                                                        <select
                                                            className="w-32 px-3 py-1 border border-gray-200 rounded text-gray-600"
                                                            onChange={(
                                                                event
                                                            ) => {
                                                                const {
                                                                    value,
                                                                } =
                                                                    event.target;
                                                                if (
                                                                    value ===
                                                                    "null"
                                                                ) {
                                                                    updateSearchParam(
                                                                        "buildingType",
                                                                        null
                                                                    );
                                                                } else {
                                                                    updateSearchParam(
                                                                        "buildingType",
                                                                        value
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <option value="null"></option>
                                                            <option value="whole_house">
                                                                一棟貸し
                                                            </option>
                                                            <option value="accomodation">
                                                                簡易宿泊
                                                            </option>
                                                            <option value="hotel">
                                                                ホテル
                                                            </option>
                                                            <option value="inn">
                                                                旅館
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {searchParams?.searchType ===
                                            "hotel" && (
                                            <>
                                                <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                                                    <div className="flex items-center justify-between p-4">
                                                        <span className="text-gray-600 text-base font-bold">
                                                            朝食付き
                                                        </span>
                                                        <Switch
                                                            checked={
                                                                searchParams?.breakfast ||
                                                                false
                                                            }
                                                            onChange={(
                                                                value
                                                            ) => {
                                                                updateSearchParam(
                                                                    "breakfast",
                                                                    value
                                                                );
                                                            }}
                                                            className={`${
                                                                searchParams?.breakfast
                                                                    ? "bg-primary"
                                                                    : "bg-gray-200"
                                                            } relative inline-flex h-6 w-11 items-center rounded-full`}
                                                        >
                                                            <span className="sr-only">
                                                                朝食付き
                                                            </span>
                                                            <span
                                                                className={`${
                                                                    searchParams?.breakfast
                                                                        ? "translate-x-6"
                                                                        : "translate-x-1"
                                                                } inline-block h-4 w-4 transform rounded-full bg-white`}
                                                            />
                                                        </Switch>
                                                    </div>
                                                    <div className="flex items-center justify-between px-4 py-3">
                                                        <span className="text-gray-600 text-base font-bold">
                                                            建物タイプ
                                                        </span>
                                                        <select
                                                            className="w-32 px-3 py-1 border border-gray-200 rounded text-gray-600"
                                                            onChange={(
                                                                event
                                                            ) => {
                                                                const {
                                                                    value,
                                                                } =
                                                                    event.target;
                                                                if (
                                                                    value ===
                                                                    "null"
                                                                ) {
                                                                    updateSearchParam(
                                                                        "buildingType",
                                                                        null
                                                                    );
                                                                } else {
                                                                    updateSearchParam(
                                                                        "buildingType",
                                                                        value
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <option value="null"></option>
                                                            <option value="WHOLE_HOUSE">
                                                                一棟貸し
                                                            </option>
                                                            <option value="SIMPLE_ACCOMODATION">
                                                                簡易宿泊
                                                            </option>
                                                            <option value="HOTEL">
                                                                ホテル
                                                            </option>
                                                            <option value="INN">
                                                                旅館
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div className="flex items-center justify-between p-4">
                                                        <span className="text-gray-600 text-base font-bold">
                                                            ペット可
                                                        </span>
                                                        <Switch
                                                            checked={
                                                                searchParams?.pet ||
                                                                false
                                                            }
                                                            onChange={(
                                                                value
                                                            ) => {
                                                                updateSearchParam(
                                                                    "pet",
                                                                    value
                                                                );
                                                            }}
                                                            className={`${
                                                                searchParams?.pet
                                                                    ? "bg-primary"
                                                                    : "bg-gray-200"
                                                            } relative inline-flex h-6 w-11 items-center rounded-full`}
                                                        >
                                                            <span className="sr-only">
                                                                ペット可
                                                            </span>
                                                            <span
                                                                className={`${
                                                                    searchParams?.pet
                                                                        ? "translate-x-6"
                                                                        : "translate-x-1"
                                                                } inline-block h-4 w-4 transform rounded-full bg-white`}
                                                            />
                                                        </Switch>
                                                    </div>
                                                    <div className="flex items-center justify-between px-4 py-3">
                                                        <span className="text-gray-600 text-base font-bold">
                                                            人数
                                                        </span>
                                                        <select
                                                            className="w-16 px-3 py-1 border border-gray-200 rounded text-gray-600"
                                                            onChange={(
                                                                event
                                                            ) => {
                                                                updateSearchParam(
                                                                    "noOfAdults",
                                                                    parseInt(
                                                                        event
                                                                            .target
                                                                            .value,
                                                                        10
                                                                    )
                                                                );
                                                            }}
                                                        >
                                                            <option value="1">
                                                                1
                                                            </option>
                                                            <option value="2">
                                                                2
                                                            </option>
                                                            <option value="3">
                                                                3
                                                            </option>
                                                            <option value="4">
                                                                4
                                                            </option>
                                                            <option value="5">
                                                                5
                                                            </option>
                                                            <option value="6">
                                                                6
                                                            </option>
                                                            <option value="7">
                                                                7
                                                            </option>
                                                            <option value="8">
                                                                8
                                                            </option>
                                                            <option value="9">
                                                                9
                                                            </option>
                                                            <option value="10">
                                                                10
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                                {/* alert section */}
                                {/* <div className="space-y-4">
                                    <Alert Icon={SpeakerphoneIcon}>
                                        <p>
                                            We are currently suspending all new
                                            bookings for the Go To Travel
                                            Campaign. We will update the details
                                            on our FAQ page as needed.
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
                                </div> */}

                                {/* view changer button */}
                                {/* <div className="flex justify-between">
                                <div className="w-32">
                                    <Select
                                        options={["おすすめ", "New"]}
                                        value={filter}
                                        onChange={(selected: string) =>
                                            setFilter(selected)
                                        }
                                    />
                                </div>
                            </div> */}

                                {/* lists section */}
                                <div>
                                    <GridViewSearch
                                        lists={algoliaSearchResults}
                                        activeIndex={activeIndex}
                                        setActiveIndex={setActiveIndex}
                                    />
                                    {/* <Pagination
                                    currentPage={page}
                                    totalPages={9}
                                    changePage={(pageNumber: number) =>
                                        setPage(pageNumber)
                                    }
                                /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="sticky top-12 hidden pt-8 pb-16 lg:block w-full h-screen col-span-4">
                        <div className="w-full h-full rounded-lg shadow-lg overflow-hidden">
                            <GoogleMap
                                markers={locationMarkers}
                                type="multi"
                                activeIndex={activeIndex}
                                setActiveIndex={setActiveIndex}
                                zoom={5}
                                onChange={handleMapChange}
                            />
                        </div>
                    </div>
                </Container>
            </div>
        </MainLayout>
    );
};

export default Search;

export const getServerSideProps = async (context) => {
    const client = createApolloClient();
    const { data } = await client.query({
        query: GET_AVAILABLE_SPACE_TYPES,
    });
    const session = await getSession(context);
    return {
        props: {
            userSession: session,
            availableSpaceTypes: data.availableSpaceTypes,
            search: context.query,
        },
    };
};
