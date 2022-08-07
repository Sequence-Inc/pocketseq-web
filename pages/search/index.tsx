import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import createApolloClient from "src/apollo/apolloClient";
import { Switch } from "@headlessui/react";
import {
    GridViewSearch,
    ListViewSearch,
    LoadingSpinner,
    SearchBoxNew,
    SearchResult,
} from "@comp";
import {
    Alert,
    Container,
    GoogleMap,
    Pagination,
    Pill,
    Select,
} from "@element";
import {
    AdjustmentsIcon,
    LightBulbIcon,
    SpeakerphoneIcon,
} from "@heroicons/react/outline";
import { MainLayout } from "@layout";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Slider } from "antd";
import { GET_AVAILABLE_SPACE_TYPES } from "src/apollo/queries/space.queries";
import { ILocationMarker } from "src/types/timebookTypes";
import { config, FormatPrice, searchHotel, searchSpace } from "src/utils";

type SearchParams = {
    area?: string;
    noOfAdults: number;
    noOfChild: number;
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
};

const Search = ({ userSession, availableSpaceTypes }) => {
    const [filter, setFilter] = useState<string>("おすすめ");
    const [sort, setSort] = useState<"grid">("grid");
    const [page, setPage] = useState<number>(1);

    const [showFilter, setShowFilter] = useState<boolean>(false);

    const [activeIndex, setActiveIndex] = useState<string | number>(-1);

    const [searchParams, setSearchParams] = useState(null);

    const [searchDataReceived, setSearchDataReceived] = useState(false);
    const [algoliaSearchResults, setAlgoliaSearchResults] = useState<
        SearchResult[]
    >([]);

    const router = useRouter();

    useEffect(() => {
        const params = router.query;
        setSearchParams(params);
    }, []);

    useEffect(() => {
        const type = searchParams?.searchType;
        const area: string = searchParams?.area as string;
        const adult = parseInt(searchParams?.noOfAdults as string, 10);
        const child = parseInt(searchParams?.noOfChild as string, 10);
        const spaceType = searchParams?.spaceType;
        const price = searchParams?.price;
        const minPrice = searchParams?.minPrice;
        const breakfast = searchParams?.breakfast;
        const pet = searchParams?.pet;
        const buildingType = searchParams?.buildingType;

        if (searchParams?.searchType === "space") {
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
                return {
                    id: result.objectID,
                    name: result.name,
                    maxAdult: result.maximumCapacity,
                    maxChild: 0,
                    price: FormatPrice("HOURLY", result.price, true, true),
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
            const { id, lat, lng, name, price, thumbnail, type } = result;
            let priceText = "";
            if (searchParams.searchType === "space") {
                priceText = `￥ ${price} /時間`;
            } else {
                priceText = `￥ ${price} /泊`;
            }
            return {
                id,
                coords: {
                    lat,
                    lng,
                },
                name,
                price,
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

    return (
        <MainLayout userSession={userSession}>
            <Head>
                <title>Search | {config.appName}</title>
            </Head>
            <div className="relative">
                <Container className="relative py-12 space-y-12 grid grid-cols-1 lg:grid-cols-9">
                    <div className="px-6 py-10 col-span-9 lg:col-span-5">
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
                                                            <option value="10">
                                                                1〜10名
                                                            </option>
                                                            <option value="15">
                                                                〜15名
                                                            </option>
                                                            <option value="20">
                                                                20名
                                                            </option>
                                                            <option value="25">
                                                                25名
                                                            </option>
                                                            <option value="30">
                                                                30名
                                                            </option>
                                                            <option value="35">
                                                                35名
                                                            </option>
                                                            <option value="40">
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
                    <div className="sticky top-0 right-0 hidden lg:block w-full h-screen col-span-4 rounded-lg shadow overflow-hidden">
                        <GoogleMap
                            markers={locationMarkers}
                            type="multi"
                            activeIndex={activeIndex}
                            setActiveIndex={setActiveIndex}
                            zoom={5}
                        />
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
        },
    };
};
