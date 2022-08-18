import React, { Dispatch, SetStateAction, useState } from "react";
import { NearestStation } from "@comp";
import { useMutation, useQuery } from "@apollo/client";
import {
    ADD_NEAREST_STATION,
    GET_STATION_BY_ID,
    REMOVE_NEAREST_STATION,
} from "src/apollo/queries/space.queries";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";
import { Button } from "@element";
import { LoadingSpinner } from "@comp";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { RefreshIcon } from "@heroicons/react/solid";
import { useGetInitialSpace } from "@hooks/useAddSpace";

export interface IOtherSpacesProps {
    activeStep: number;
    setActiveStep: Dispatch<SetStateAction<number>>;
    steps: any[];
    selectedSpaceId?: any;
    spaceId?: any;
    refetch?: any;
}

const NearestStationStep = ({
    activeStep,
    setActiveStep,
    steps,
    spaceId,
    selectedSpaceId,
}: IOtherSpacesProps) => {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toggleForm, setToggleForm] = useState(false);
    const [mutate] = useMutation(ADD_NEAREST_STATION, {
        onCompleted: (data) => refetchSpaceDetail(),
    });
    const { initialValue, spaceDetailLoading, refetchSpaceDetail } =
        useGetInitialSpace(spaceId);

    const [mutateRemoveStation] = useMutation(REMOVE_NEAREST_STATION, {
        onCompleted: (data) => refetchSpaceDetail(),
    });
    const [activeStation, setActiveStation] = useState(-1);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (initialValue?.nearestStations) {
            const newValue = initialValue.nearestStations?.map((res) => ({
                stationId: res.station.id,
                via: res.via,
                time: res.time,
            }));
            setStations(newValue);
        }
    }, [initialValue?.nearestStations]);

    const handleStation = async () => {
        if (stations.length > 0) handleNext();
    };

    const showForm = () => {
        setToggleForm(true);
    };

    const closeForm = () => {
        setToggleForm(false);
    };

    const addStation = async ({ stationId, via, time }) => {
        const { data } = await mutate({
            variables: {
                spaceId: id || spaceId,
                stations: [{ stationId, via, time: parseInt(time) }],
            },
        });
        if (data) {
            closeForm();
            setStations([
                ...stations,
                { stationId, via, time: parseInt(time) },
            ]);
        }
    };
    const removeStation = async (index, stationId) => {
        setLoading(true);
        setActiveStation(index);
        try {
            const { data } = await mutateRemoveStation({
                variables: {
                    input: {
                        spaceId: id || spaceId,
                        stationId,
                    },
                },
            });
            if (data) {
                const newStations = stations.filter(
                    (station, idx) => idx !== index
                );
                setStations(newStations);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const hasPrevious: boolean = activeStep > 0 && true;
    const hasNext: boolean = activeStep < steps.length - 1 && true;

    const handlePrevious = (): void => {
        if (hasPrevious) setActiveStep(activeStep - 1);
    };

    function handleNext(): void {
        if (hasNext) setActiveStep(activeStep + 1);
    }

    if (spaceDetailLoading)
        return <LoadingSpinner loadingText="Loading nearest stations" />;

    return (
        <div className="">
            <div className="px-4 py-2 border-b border-gray-200 sm:px-6 sm:py-5 bg-gray-50">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    最寄り駅
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    施設様のご利用しやすい最寄り駅をお選びください
                    <br />
                    ※複数お選びいただけます。
                </p>
            </div>
            <div className="w-full my-6 space-y-3 sm:w-96 sm:ml-64">
                <h3 className="font-medium text-gray-700">Stations</h3>
                {stations.map((station, index) => {
                    return (
                        <StationItem
                            key={index}
                            index={index}
                            station={station}
                            removeStation={removeStation}
                            isLoading={
                                loading && activeStation === index && true
                            }
                        />
                    );
                })}
            </div>
            <div className="mb-8">
                {stations.length < 0 ? (
                    <p className="text-sm text-center text-gray-800">
                        No Nearest station added yet. Please in below button to
                        add new station
                    </p>
                ) : null}
                {toggleForm && (
                    <NearestStation onAdd={addStation} closeForm={closeForm} />
                )}
                {toggleForm ? null : (
                    <div className="items-center flex-none sm:space-x-4 sm:flex">
                        <div className="block text-sm font-medium text-gray-700 sm:text-right w-60">
                            &nbsp;
                        </div>
                        <div className="relative rounded-md sm:w-96">
                            <button
                                onClick={showForm}
                                className="flex items-center justify-center w-full p-2 text-sm font-medium text-gray-500 bg-gray-100 border border-transparent rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-gray-200 focus:ring-gray-300"
                            >
                                <PlusIcon className="w-5 h-5 mr-2 text-inherit" />
                                Add station
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex justify-between px-4 py-5 border-t border-gray-100 bg-gray-50 sm:px-6">
                <>
                    <Button
                        className="w-auto px-8"
                        disabled={!hasPrevious || loading}
                        onClick={handlePrevious}
                    >
                        Previous
                    </Button>
                    <Button
                        disabled={!stations?.length}
                        variant="primary"
                        className="w-auto px-8"
                        onClick={handleStation}
                        loading={loading}
                    >
                        Next
                    </Button>
                </>
            </div>
        </div>
    );
};

export default NearestStationStep;

const StationItem = ({ index, station, removeStation, isLoading }) => {
    const { stationId, via, time } = station;

    const { data, loading, error } = useQuery(GET_STATION_BY_ID, {
        variables: { id: parseInt(stationId, 10) },
        skip: !stationId,
        fetchPolicy: "network-only",
    });

    if (loading) return <div key={index}>Loading...</div>;
    if (error) return <div key={index}>{error}</div>;

    const { id, stationName } = data.stationByID;
    return (
        <div
            key={id}
            className="flex items-center px-4 py-3 text-white rounded-md bg-primary"
        >
            <div className="flex-auto">
                {stationName}駅から{via}
                {time}分
            </div>
            {isLoading ? (
                <svg
                    version="1.1"
                    id="loader-1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    className="w-6 h-6 mr-3 text-green-200 animate-spin"
                    viewBox="0 0 50 50"
                >
                    <path
                        fill="currentColor"
                        d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
                    ></path>
                </svg>
            ) : (
                <button onClick={() => removeStation(index, stationId)}>
                    <TrashIcon className="w-6 h-6 text-green-200 hover:text-green-100" />
                </button>
            )}
        </div>
    );
};
