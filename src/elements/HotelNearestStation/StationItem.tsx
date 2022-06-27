import React from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";

const StationItem = ({ station }) => {
    const { name, location, trainLine, accessType, time } = station;
    return (
        <div className="px-4 py-4 shadow-station rounded-statiom">
            <div className=" w-full flex items-center justify-between mb-1">
                <p className="text-indigo-600 text-sm font-medium">{name}</p>
                <div className="flex items-center px-1.5 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    <p>{time + " on " + accessType}</p>
                </div>
            </div>

            <div className=" w-full flex items-center justify-start space-x-3">
                <div className="flex space-x-1 items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>

                    <p className="text-gray-500">{trainLine}</p>
                </div>
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
                    <p className="text-gray-500">{location}</p>
                </div>
            </div>
        </div>
    );
};

export default StationItem;
