import React, { useState } from "react";
import { NearestStation } from "@comp";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_NEAREST_STATION, GET_STATION_BY_ID } from "src/apollo/queries/space.queries";
import { TrashIcon } from "@heroicons/react/outline";
import { Button } from "@element";

const NearestStationStep = ({ activeStep, setActiveStep, steps, spaceId }) => {
    const [stations, setStations] = useState([]);
    const [mutate] = useMutation(ADD_NEAREST_STATION);

    const addStation = ({ stationId, via, time }) => {
        setStations([...stations, { stationId, via, time: parseInt(time) }]);
    };
    const removeStation = (index) => {
        const newStations = stations.filter((station, idx) => idx !== index);
        setStations(newStations);
    };

    const hasPrevious: boolean = activeStep > 0 && true;
    const hasNext: boolean = activeStep < steps.length - 1 && true;

    const handlePrevious = (): void => {
        if (hasPrevious) setActiveStep(activeStep - 1);
    };

    function handleNext(): void {
        if (hasNext) setActiveStep(activeStep + 1);
    }

    const handleStation = async () => {
        const { data } = await mutate({ variables: { spaceId, stations } })
        console.log(data)
        if (data) handleNext();
    }

    return (
        <div className="">
            <div className="px-4 py-2 border-b border-gray-200 sm:px-6 sm:py-5 bg-gray-50">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Nearest stations
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    Please select all the nearest stataions to the space venue.
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
                        />
                    );
                })}
            </div>
            <div className="mb-8">
                <NearestStation onAdd={addStation} />
            </div>
            <div className="flex justify-between px-4 py-5 border-t border-gray-100 bg-gray-50 sm:px-6">
                <Button
                    className="w-auto px-8"
                    disabled={!hasPrevious}
                    onClick={handlePrevious}
                >
                    Previous
                </Button>
                <Button
                    variant="primary"
                    className="w-auto px-8"
                    onClick={handleStation}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default NearestStationStep;

const StationItem = ({ index, station, removeStation }) => {
    const { stationId, via, time } = station;

    const { data, loading, error } = useQuery(GET_STATION_BY_ID, {
        variables: { id: parseInt(stationId, 10) },
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
            <button onClick={() => removeStation(index)}>
                <TrashIcon className="w-6 h-6 text-green-200 hover:text-green-100" />
            </button>
        </div>
    );
};
