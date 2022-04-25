import { useQuery } from "@apollo/client";
import {
    GridViewSearch,
    ListViewSearch,
    LoadingSpinner,
    SearchBox,
} from "@comp";
import { Alert, GoogleMap, Pagination, Pill, Select } from "@element";
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
import React, { useEffect } from "react";
import { useState } from "react";
import createApolloClient from "src/apollo/apolloClient";
import { GET_AVAILABLE_SPACE_TYPES } from "src/apollo/queries/space.queries";
import {
    ILocationMarker,
    IPhoto,
    IRating,
    ISpace,
} from "src/types/timebookTypes";
import { config, FormatPrice, searchSpace } from "src/utils";

const Secondary = ({ resetToStartObj, userSession, availableSpaceTypes }) => {
    const [filter, setFilter] = useState<string>("おすすめ");
    const [sort, setSort] = useState<"list" | "grid">("list");
    const [page, setPage] = useState<number>(1);
    const [activeIndex, setActiveIndex] = useState<string | number>(-1);

    const [area, setArea] = useState(null);
    const [spaceTypes, setSpaceTypes] = useState(null);

    const [searchDataReceived, setSearchDataReceived] = useState(false);
    const [algoliaSearchResults, setAlgoliaSearchResults] = useState([]);

    useEffect(() => {
        searchSpace("", {
            city: area,
            spaceType: spaceTypes,
        })
            .then((data) => {
                if (data.nbHits > 0) {
                    console.log(data);
                    setAlgoliaSearchResults(
                        data.hits.map((result: any) => {
                            return {
                                id: result.objectID,
                                name: result.name,
                                maximumCapacity: result.maximumCapacity,
                                numberOfSeats: result.numberOfSeats,
                                spaceTypes: result.spaceTypes.map((type) => ({
                                    title: type,
                                })),
                                spaceSize: result.spaceSize,
                                spacePricePlans: result.price,
                                address: {
                                    prefecture: { name: result.prefecture },
                                    city: result.city,
                                    latitude: result._geoloc?.lat,
                                    longitude: result._geoloc?.lng,
                                },
                                photos: [
                                    {
                                        medium: {
                                            url: result.thumbnail,
                                        },
                                    },
                                ],
                            };
                        })
                    );
                } else {
                    setAlgoliaSearchResults([]);
                }
            })
            .finally(() => {
                setSearchDataReceived(true);
            });
    }, [area, spaceTypes]);

    // const { data, loading, error } = useQuery(GET_TOP_PICK_SPACES, {
    //     variables: {
    //         paginationInfo: {
    //             take: 4,
    //             skip: 0,
    //         },
    //     },
    //     fetchPolicy: "network-only",
    // });

    // if (error) {
    //     return <h3>Error occurred: {error.message}</h3>;
    // }

    // if (loading) {
    //     return <h3>Loading...</h3>;
    // }

    if (!searchDataReceived) {
        return <LoadingSpinner />;
    }

    // const searchResults: ISpace[] = data.allSpaces.data;
    const searchResults: ISpace[] = algoliaSearchResults;
    console.log(searchResults);
    const locationMarkers: ILocationMarker[] = searchResults.map(
        (space: ISpace) => {
            return {
                id: space.id,
                coords: {
                    lat: space.address.latitude,
                    lng: space.address.longitude,
                },
                name: space.name,
                price: FormatPrice("HOURLY", space.spacePricePlans, true, true),
                photo: space.photos[0],
                rating: {
                    reviews: 1,
                    points: 5,
                },
            };
        }
    );

    const handleFilterChange = ({ area, purpose }) => {
        setArea(area);
        setSpaceTypes(purpose);
    };

    return (
        <MainLayout userSession={userSession}>
            <Head>
                <title>Search | {config.appName}</title>
            </Head>
            <div className="relative grid grid-cols-1 lg:grid-cols-9">
                <div className="px-6 py-10 mt-16 lg:col-span-5">
                    <div className="flex justify-center">
                        <SearchBox
                            onChange={handleFilterChange}
                            availableSpaceTypes={availableSpaceTypes}
                        />
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
                                            lists={searchResults}
                                            activeIndex={activeIndex}
                                            setActiveIndex={setActiveIndex}
                                        />
                                    </div>
                                ) : sort === "grid" ? (
                                    <GridViewSearch
                                        lists={searchResults}
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
                        markers={locationMarkers}
                        type="multi"
                        activeIndex={activeIndex}
                        setActiveIndex={setActiveIndex}
                    />
                </div>
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
