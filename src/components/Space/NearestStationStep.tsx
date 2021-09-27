import React, { useState } from "react";
import { NearestStation } from "@comp";
import { useQuery } from "@apollo/client";
import { GET_STATION_BY_ID } from "src/apollo/queries/space.queries";
import { TrashIcon } from "@heroicons/react/outline";

const NearestStationStep = () => {
    const [stations, setStations] = useState([]);

    const addStation = ({ stationId, via, time }) => {
        setStations([...stations, { stationId, via, time }]);
    };
    const removeStation = (index) => {
        const newStations = stations.filter((station, idx) => idx !== index);
        setStations(newStations);
    };
    return (
        <div className="py-4">
            <div className="w-full sm:w-96 sm:ml-64 mb-5 mt-3 space-y-3">
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
            <NearestStation onAdd={addStation} />
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
            className="flex items-center py-3 px-4 rounded-md bg-primary text-white"
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
