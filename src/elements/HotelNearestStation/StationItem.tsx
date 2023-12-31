import React, { useEffect, useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/solid";
import { GET_STATION_BY_ID } from "src/apollo/queries/space.queries";
import { GET_PREFECTURES } from "src/apollo/queries/station.queries";
import { useQuery, useLazyQuery } from "@apollo/client";
import Button from "../Button";
type TStationItem = {
    name?: string;
    location?: string;
    trainLine?: string;
    accessType?: string;
    time?: string;
};

const StationItem = ({ station, onRemoveStation }) => {
    const { stationId, accessType, time, isDefault = false } = station;

    const [stationDetail, setDetails] = useState<TStationItem>();

    const { data, loading, error } = useQuery(GET_STATION_BY_ID, {
        variables: { id: parseInt(stationId, 10) },
        skip: !stationId,
        fetchPolicy: "network-only",
    });

    const [
        getPrefecturById,
        {
            data: prefectureData,
            loading: prefectureLoading,
            error: prefectureError,
        },
    ] = useLazyQuery(GET_PREFECTURES);

    useEffect(() => {
        if (!data?.stationByID?.prefectureCode) {
            return;
        }
        getPrefecturById({
            variables: {
                prefectureId: parseInt(
                    data.stationByID.prefectureCode.toString(),
                    10
                ),
            },
        });
    }, [data?.stationByID?.prefectureCode]);

    useEffect(() => {
        if (
            !prefectureData?.availablePrefectures?.length ||
            !data?.stationByID?.prefectureCode
        ) {
            return;
        }

        const prefecture = prefectureData.availablePrefectures.find((item) => {
            return (
                parseInt(item.id, 10) ===
                parseInt(data.stationByID.prefectureCode, 10)
            );
        });

        setDetails(
            (prev) =>
                (prev && { ...prev, location: prefecture?.name }) || {
                    location: prefecture?.name,
                }
        );
    }, [
        data?.stationByID?.prefectureCode,
        prefectureData?.availablePrefectures,
    ]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const { id, stationName } = data.stationByID;

    return (
        <div className="w-full relative block">
            {isDefault && (
                <Button
                    className=" max-w-min absolute -right-4 -top-3 mb-3 bg-transparent hover:bg-transparent border-0 text-red-400 hover:text-red-200"
                    Icon={TrashIcon}
                    onClick={() => onRemoveStation(station)}
                >
                    {" "}
                </Button>
            )}
            <div className="px-4 py-4 shadow-station rounded-statiom ">
                <div className=" w-full flex items-center justify-between mb-1">
                    <div className="text-indigo-600 text-sm font-medium">
                        {stationName}
                    </div>
                    <div className="flex items-center px-1.5 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        <div>{time + " on " + accessType}</div>
                    </div>
                </div>

                <div className=" w-full flex items-center justify-start space-x-3">
                    {/* <div className="flex space-x-1 items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>

                    <div className="text-gray-500">{trainLine}</div>
                </div> */}
                    <div className="flex space-x-1 items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div className="text-gray-500">
                            {stationDetail?.location}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StationItem;
