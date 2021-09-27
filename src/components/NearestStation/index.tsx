import React, { useState, useCallback } from "react";
import { Select, TextField } from "@element";
import { useQuery, useLazyQuery } from "@apollo/client";
import {
    GET_LINES,
    GET_PREFECTURES,
    GET_STATIONS,
} from "src/apollo/queries/station.queries";
import { PlusIcon } from "@heroicons/react/outline";

export const NearestStation = ({ station }) => {
    const [loading, setLoading] = useState(false);
    const [prefectureId, setPrefectureId] = useState(null);
    const [lineId, setLineId] = useState(null);
    const [stationId, setStationId] = useState(null);

    const {
        data: prefectureData,
        loading: prefectureLoading,
        error: prefectureError,
    } = useQuery(GET_PREFECTURES);

    const [
        getTrainLines,
        {
            data: trainLinesData,
            loading: trainLinesLoading,
            error: trainLinesError,
        },
    ] = useLazyQuery(GET_LINES);

    const [
        getStations,
        { data: stationsData, loading: stationsLoading, error: stationsError },
    ] = useLazyQuery(GET_STATIONS);

    if (station) {
        const { id, prefectureId, trainLineId, stationId, via, time } = station;
    }

    const getAllData = async ({ prefectureId, trainLindId, stationId }) => {
        try {
            // get
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <>
            <div>
                <Select
                    label="県"
                    options={prefectureData?.availablePrefectures || []}
                    // error={}
                    onChange={(selectedPrefectureId) => {
                        setPrefectureId(selectedPrefectureId);
                        getTrainLines({
                            variables: {
                                prefectureId: parseInt(
                                    selectedPrefectureId.toString(),
                                    10
                                ),
                            },
                        });
                    }}
                    value={prefectureId}
                    errorMessage="県が必要です。"
                    labelKey="name"
                    valueKey="id"
                    disabled={loading}
                    singleRow
                />
            </div>

            <div>
                <Select
                    label="路線名"
                    options={trainLinesData?.linesByPrefecture || []}
                    onChange={(selectedLineId) => {
                        setLineId(selectedLineId);
                        getStations({
                            variables: {
                                lineId: parseInt(selectedLineId.toString(), 10),
                            },
                        });
                    }}
                    value={lineId}
                    errorMessage="路線名が必要です。"
                    labelKey="name"
                    valueKey="id"
                    disabled={loading}
                    singleRow
                />
            </div>

            <div>
                <Select
                    label="駅名"
                    options={stationsData?.stationsByLine || []}
                    onChange={(selectedStationId) => {
                        setStationId(selectedStationId);
                    }}
                    value={stationId}
                    errorMessage="駅名が必要です。"
                    labelKey="stationName"
                    valueKey="id"
                    disabled={loading}
                    singleRow
                />
            </div>

            <div>
                <TextField
                    // defaultValue={}
                    label="Via"
                    // error={}
                    errorMessage="Via is required"
                    disabled={loading}
                    onChange={(event) => console.log(event)}
                    singleRow
                />
            </div>

            <div>
                <TextField
                    // defaultValue={}
                    label="Time"
                    // error={}
                    errorMessage="Time is required"
                    type="number"
                    disabled={loading}
                    onChange={(event) => console.log(event)}
                    singleRow
                />
            </div>
            <div className="sm:space-x-4 flex-none sm:flex items-center">
                <div className="block text-sm font-medium text-gray-700 sm:text-right w-60">
                    &nbsp;
                </div>
                <div className="relative rounded-md sm:w-96">
                    <button className="w-full flex items-center justify-center text-sm font-medium border border-transparent shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 text-gray-500 bg-gray-100 hover:bg-gray-200 focus:ring-gray-300 rounded p-2">
                        <PlusIcon className="w-5 h-5 mr-2 text-inherit" />
                        Add
                    </button>
                </div>
            </div>
        </>
    );
};
