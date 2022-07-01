import React, { useState } from "react";

import StationItem from "./StationItem";
import AddStationForm from "./AddStationForm";
import TextField from "../TextField";
import Button from "../Button";

const STATIONS = [
    // {
    //     name: "Omori Station",
    //     location: "Tokyo",
    //     trainLine: "Keihin Tohoku Line",
    //     accessType: "foot",
    //     time: "10 min",
    // },
    // {
    //     name: "Kamata Station",
    //     location: "Tokyo",
    //     trainLine: "Keihin Tohoku Line",
    //     accessType: "foot",
    //     time: "15 min",
    // },
];

export const HotelNearestStation = React.forwardRef<HTMLInputElement, any>(
    (props, ref) => {
        const [stations, setStations] = useState<any[]>(STATIONS);
        const [toggleForm, setToggleForm] = useState(false);

        const showForm = () => {
            setToggleForm(true);
        };
        const closeForm = () => setToggleForm(false);

        const addStation = async ({ stationId, via, time }) => {
            closeForm();
            setStations([
                ...stations,
                { stationId, via, time: parseInt(time) },
            ]);
        };

        return (
            <div className="w-full">
                <div className="mb-3">
                    {stations.map((station, index) => {
                        return <StationItem key={index} station={station} />;
                    })}
                    {!toggleForm && stations.length < 1 ? (
                        <p className="text-sm text-center text-gray-800">
                            No Nearest station added yet. Please in below button
                            to add new station
                        </p>
                    ) : null}
                </div>
                {/* <div className="space-y-2">
                    <div className="lg:w-80 md:w-9/12 sm:w-full space-y-2">
                        <p className="text-sm leading-5 font-medium">
                            Province
                        </p>
                        <TextField
                            label=""
                            onChange={() => {}}
                            placeholder={"Please select"}
                        />
                    </div>
                    <div className="lg:w-80 md:w-9/12 sm:w-full space-y-2">
                        <p className="text-sm leading-5 font-medium">
                            Train Line
                        </p>
                        <TextField
                            label=""
                            onChange={() => {}}
                            placeholder={"Please select"}
                        />
                    </div>
                    <div className="lg:w-80 md:w-9/12 sm:w-full space-y-2">
                        <p className="text-sm leading-5 font-medium">
                            Train Station
                        </p>
                        <TextField
                            label=""
                            onChange={() => {}}
                            placeholder={"Please select"}
                        />
                    </div>
                    <div className="lg:w-80 md:w-9/12 sm:w-full space-y-2">
                        <p className="text-sm leading-5 font-medium">
                            Access type
                        </p>
                        <TextField
                            label=""
                            onChange={() => {}}
                            placeholder={"Please select"}
                        />
                    </div>
                    <div className="lg:w-80 md:w-9/12 sm:w-full space-y-2">
                        <p className="text-sm leading-5 font-medium">Time</p>
                        <TextField label="" onChange={() => {}} type="number" />
                    </div>
                </div>
                <div className="flex max-w-sm border-t mt-4 py-4 items-center justify-end space-x-3">
                    <Button
                        type="button"
                        className="bg-indigo-100 w-28 text-indigo-700"
                    >
                        Add Station
                    </Button>
                    <Button type="button" className=" w-28 ">
                        Cancel
                    </Button>
                </div> */}
                {toggleForm && (
                    <AddStationForm onAdd={addStation} closeForm={closeForm} />
                )}
                {!toggleForm && (
                    <div className="flex border-t mt-4 py-4 items-center justify-end space-x-3">
                        <Button
                            type="button"
                            onClick={showForm}
                            className="bg-indigo-100 w-28 text-indigo-700"
                        >
                            Add Station
                        </Button>
                    </div>
                )}
            </div>
        );
    }
);
export default HotelNearestStation;
