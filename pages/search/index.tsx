import { useQuery } from "@apollo/client";
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
    LightBulbIcon,
    SpeakerphoneIcon,
    ViewGridAddIcon,
    ViewListIcon,
} from "@heroicons/react/outline";
import { MainLayout } from "@layout";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useState } from "react";
import createApolloClient from "src/apollo/apolloClient";
import {
    GET_AVAILABLE_SPACE_TYPES,
    GET_TOP_PICK_SPACES,
} from "src/apollo/queries/space.queries";
import {
    ILocationMarker,
    IPhoto,
    IRating,
    ISpace,
} from "src/types/timebookTypes";
import { config, FormatPrice, searchHotel, searchSpace } from "src/utils";

type SearchParams = {
    area?: string;
    noOfAdults: number;
    noOfChild: number;
    searchType: "hotel" | "space";
    checkInDate: string;
    checkOutDate?: string;
};

const Secondary = ({ userSession, availableSpaceTypes }) => {
    const [filter, setFilter] = useState<string>("おすすめ");
    const [sort, setSort] = useState<"grid">("grid");
    const [page, setPage] = useState<number>(1);
    const [activeIndex, setActiveIndex] = useState<string | number>(-1);

    const [searchParams, setSearchParams] = useState(null);

    const [searchDataReceived, setSearchDataReceived] = useState(false);
    const [algoliaSearchResults, setAlgoliaSearchResults] = useState<
        SearchResult[]
    >([]);

    const router = useRouter();
    const params = router.query;

    useEffect(() => {
        setSearchParams(params);
    }, []);

    useEffect(() => {
        const area: string = searchParams?.area as string;
        const type = searchParams?.searchType;
        const adult = parseInt(searchParams?.noOfAdults as string, 10);
        const child = parseInt(searchParams?.noOfChild as string, 10);
        console.log(adult, child);
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

    const onHandleSearchDataChange = (searchParams) => {
        console.log("searchAgain");
        setSearchParams(searchParams);
    };

    return (
        <MainLayout userSession={userSession}>
            <Head>
                <title>Search | {config.appName}</title>
            </Head>
            <div className="relative">
                {/* <div className="px-6 py-10 mt-16 w-full bg-gray-100">
                    <div className="flex justify-center">
                        <SearchBoxNew
                            defaultValue={searchParams}
                            onChange={onHandleSearchDataChange}
                        />
                    </div>
                </div> */}
                <Container className="relative py-12 space-y-12 grid grid-cols-1 lg:grid-cols-9">
                    <div className="px-6 py-10 col-span-9 lg:col-span-5">
                        <div>
                            <h1 className="mb-6 text-3xl font-bold text-gray-700">
                                {algoliaSearchResults?.length}
                                件を超える
                                {searchParams.searchType === "hotel"
                                    ? "宿泊先"
                                    : "スペース"}
                            </h1>
                            <div className="space-y-8">
                                {/* <div className="space-x-2">
                                <Pill>料金</Pill>
                                <Pill>会場タイプ</Pill>
                                <Pill>人数</Pill>
                                <Pill>詳細条件</Pill>
                            </div> */}

                                {/* alert section */}
                                <div className="space-y-4">
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
                                </div>

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

export default Secondary;

export const getServerSideProps = async (context) => {
    // const session = await getSession(context);
    // return {
    //     props: {
    //         userSession: session,
    //     },
    // };
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
