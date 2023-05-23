import { GoogleMap, Tag } from "@element";
import { MapIcon } from "@heroicons/react/outline";
import React from "react";

import { IAddress, INearestStation } from "../../types/timebookTypes";

export interface ISpaceAccessInfoProps {
    address: IAddress;
    nearestStations: INearestStation[];
}

export const SpaceInfoAccess = ({
    address,
    nearestStations,
}: ISpaceAccessInfoProps) => {
    const { prefecture, city, addressLine1, addressLine2 } = address;
    const fullAddress = `${prefecture.name}${city}${addressLine1}${addressLine2}`;

    const renderNearestStation = (station: INearestStation): string => {
        return `${station.station.stationName}より${
            station.via || station.accessType
        }${station.time}分`;
    };

    return (
        <div>
            <div className="mb-4 text-lg font-bold text-gray-700">アクセス</div>
            <div className="flex mb-4">
                <div className="w-32 text-sm font-bold text-gray-800">住所</div>
                <div className="text-sm text-gray-500">{fullAddress}</div>
            </div>
            <div className="flex mb-4">
                <div className="w-32 text-sm font-bold text-gray-800">
                    アクセス
                </div>
                <div className="text-sm text-gray-500">
                    <ul>
                        {nearestStations.map((station, index) => {
                            return (
                                <li key={index}>
                                    {renderNearestStation(station)}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            {/* <div className="w-full mt-6 mb-4 rounded bg-green-50 aspect-w-16 aspect-h-6" /> */}
            <div className="w-full mt-6 mb-4 rounded aspect-w-16 aspect-h-9">
                <div className="w-full h-full">
                    <GoogleMap
                        mark={{ lat: address.latitude, lng: address.longitude }}
                        zoom={15}
                        setFreeCoords={() => {}}
                    />
                </div>
            </div>
            <div className="flex justify-end">
                <Tag
                    Icon={MapIcon}
                    iconSize={5}
                    iconStyle="text-gray-600"
                    textStyle="text-sm text-gray-600"
                    numberOfLines={1}
                >
                    GoogleMapで場所を確認する
                </Tag>
            </div>
        </div>
    );
};
