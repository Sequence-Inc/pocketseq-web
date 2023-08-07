import React, { useState } from "react";
import { Button, Select, TextField } from "@element";
import { useQuery, useLazyQuery } from "@apollo/client";
import {
    GET_LINES,
    GET_PREFECTURES,
    GET_STATIONS,
} from "src/apollo/queries/station.queries";
import AlertModal from "../AlertModal";
import { useModalDialog } from "@hooks/useModalDialog";

export const NearestStation = ({ onAdd, closeForm }) => {
    const [loading, setLoading] = useState(false);
    const [prefectureId, setPrefectureId] = useState(null);
    const [lineId, setLineId] = useState(null);
    const [stationId, setStationId] = useState(null);
    const [via, setVia] = useState("");
    const [time, setTime] = useState(0);
    const [exit, setExit] = useState("");

    const {
        isModalOpen,
        openModal,
        closeModal,
        setModalData,
        modalContent,
        modalData,
    } = useModalDialog();

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Check everything
        setLoading(true);
        if (
            !prefectureId ||
            !lineId ||
            !stationId ||
            via.trim() === "" ||
            !time ||
            !exit
        ) {
            setModalData({
                intent: "ERROR",
                title: "エラーが発生しました",
                text: "必要な情報をすべて入力してください。",
            });
            openModal();
            setLoading(false);
            return;
        }
        await onAdd({ prefectureId, lineId, stationId, via, time, exit });
        setLoading(false);
    };

    return (
        <div className="space-y-4">
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
                {/* <TextField
                    // defaultValue={}
                    label="Via"
                    // error={}
                    errorMessage="Via is required"
                    disabled={loading}
                    onChange={(event) => setVia(event.target.value)}
                    value={via}
                    singleRow
                /> */}
                <Select
                    label="最寄駅からのアクセス"
                    value={via}
                    options={["徒歩", "車／タクシー", "バス"]}
                    onChange={(event) => setVia(event as string)}
                    errorMessage="最寄駅からのアクセス is required"
                    disabled={loading}
                    singleRow
                />
            </div>

            <div>
                <TextField
                    // defaultValue={}
                    label="時間"
                    // error={}
                    errorMessage="時間 is required"
                    type="number"
                    disabled={loading}
                    onChange={(event) => {
                        if (event.target.value < 0) return;
                        setTime(event.target.value);
                    }}
                    value={time}
                    singleRow
                />
            </div>

            <div>
                <TextField
                    // defaultValue={}
                    label="Exit"
                    // error={}
                    errorMessage="Exit is required"
                    type="text"
                    disabled={loading}
                    onChange={(event) => {
                        setExit(event.target.value);
                    }}
                    value={exit}
                    singleRow
                />
            </div>
            <div className="items-center flex-none sm:space-x-4 sm:flex">
                <div className="block text-sm font-medium text-gray-700 sm:text-right w-60">
                    &nbsp;
                </div>
                <div className="relative rounded-md sm:w-96 sm:flex sm:space-x-3">
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        loading={loading}
                    >
                        Add station
                    </Button>
                    <Button onClick={closeForm} disabled={loading}>
                        Cancel
                    </Button>
                </div>
            </div>
            <AlertModal
                isOpen={isModalOpen}
                disableTitle={true}
                disableDefaultIcon={true}
                setOpen={() => {
                    closeModal();
                    setModalData(null);
                }}
                disableClose={true}
            >
                <div className="text-sm text-gray-500">{modalContent}</div>
            </AlertModal>
        </div>
    );
};
