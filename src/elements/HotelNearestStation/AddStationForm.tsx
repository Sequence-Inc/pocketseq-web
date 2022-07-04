import React, { useState } from "react";
import { Button, Select, TextField } from "@element";
import { useQuery, useLazyQuery } from "@apollo/client";
import {
    GET_LINES,
    GET_PREFECTURES,
    GET_STATIONS,
} from "src/apollo/queries/station.queries";

import AlertModal from "src/components/AlertModal";

const AddStationForm = ({ onAdd, closeForm }) => {
    const [loading, setLoading] = useState(false);
    const [prefectureId, setPrefectureId] = useState(null);
    const [lineId, setLineId] = useState(null);
    const [stationId, setStationId] = useState(null);
    const [accessType, setAccessType] = useState("");
    const [time, setTime] = useState(0);
    const [alertModalOpen, setAlertModal] = useState(false);
    const toggleAlertModal = () => {
        console.log("toggler clled");
        setAlertModal((prev) => !prev);
    };

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

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        if (
            !prefectureId ||
            !lineId ||
            !stationId ||
            accessType.trim() === "" ||
            !time
        ) {
            toggleAlertModal();
            setLoading(false);
            return;
        }
        await onAdd({ prefectureId, lineId, stationId, accessType, time });
        setLoading(false);
    };

    return (
        <div className="space-y-4">
            <AlertModal
                toggle={toggleAlertModal}
                isOpen={alertModalOpen}
                title="Warning"
            >
                <p>All fields must be present</p>
            </AlertModal>
            <div>
                <p className="text-sm leading-5 font-medium">県</p>
                <Select
                    label=""
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
                />
            </div>

            <div>
                <p className="text-sm leading-5 font-medium">路線名</p>

                <Select
                    label=""
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
                    loading={trainLinesLoading}
                />
            </div>

            <div>
                <p className="text-sm leading-5 font-medium">駅名</p>

                <Select
                    label=""
                    options={stationsData?.stationsByLine || []}
                    onChange={(selectedStationId) => {
                        setStationId(selectedStationId);
                    }}
                    value={stationId}
                    errorMessage="駅名が必要です。"
                    labelKey="stationName"
                    valueKey="id"
                    disabled={loading}
                    loading={stationsLoading}
                />
            </div>

            <div>
                <p className="text-sm leading-5 font-medium">
                    最寄駅からのアクセス
                </p>

                <Select
                    label=""
                    value={accessType}
                    options={["徒歩", "車／タクシー", "バス"]}
                    onChange={(event) => setAccessType(event as string)}
                    errorMessage="最寄駅からのアクセス is required"
                    disabled={loading}
                />
            </div>

            <div>
                <p className="text-sm leading-5 font-medium">時間</p>
                <TextField
                    // defaultValue={}
                    label=""
                    // error={}
                    errorMessage="時間 is required"
                    type="number"
                    disabled={loading}
                    onChange={(event) => setTime(event.target.value)}
                    value={time}
                />
            </div>
            <div className="flex border-t mt-4 py-4 items-center justify-end space-x-3">
                <Button
                    type="submit"
                    onClick={onSubmit}
                    className="bg-indigo-100 w-28 text-indigo-700"
                >
                    Add Station
                </Button>
                <Button type="button" onClick={closeForm} className=" w-28 ">
                    Cancel
                </Button>
            </div>
        </div>
    );
};
export default AddStationForm;