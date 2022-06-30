import React, { useState } from "react";

import StationItem from "./StationItem";
import TextField from "../TextField";
import Button from "../Button";

const STATIONS = [
    {
        name: "Omori Station",
        location: "Tokyo",
        trainLine: "Keihin Tohoku Line",
        accessType: "foot",
        time: "10 min",
    },

    {
        name: "Kamata Station",
        location: "Tokyo",
        trainLine: "Keihin Tohoku Line",
        accessType: "foot",
        time: "15 min",
    },
];

export const HotelNearestStation = React.forwardRef<HTMLInputElement, any>(
    (props, ref) => {
        const [stations, setStations] = useState<any[]>(STATIONS);

        return (
            <div>
                <div className="space-y-2">
                    <div className="w-6/12 mb-3">
                        {stations.map((station, index) => {
                            return (
                                <StationItem key={index} station={station} />
                            );
                        })}
                    </div>
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
                </div>
            </div>
        );
    }
);
export default HotelNearestStation;
