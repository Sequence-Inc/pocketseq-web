import React, { useCallback, useEffect, useState } from "react";

import StationItem from "./StationItem";
import AddStationForm from "./AddStationForm";
import TextField from "../TextField";
import Button from "../Button";
import { TStationTypes } from "@appTypes/timebookTypes";
isFinite;

interface IHotelNearestStation {
    onChange: any;
    defaultValues?: any;
    onAddHotelStation?: any;
    onRemoveStation?: any;
}

export const HotelNearestStation = React.forwardRef<
    HTMLInputElement,
    IHotelNearestStation
>((props, ref) => {
    const { onChange, defaultValues, onAddHotelStation, onRemoveStation } =
        props;
    const [stations, setStations] = useState<TStationTypes[]>([]);
    const [toggleForm, setToggleForm] = useState(false);
    const showForm = () => {
        setToggleForm(true);
    };
    const closeForm = () => setToggleForm(false);

    const addStation = async ({ stationId, accessType, time }) => {
        closeForm();
        setStations([
            ...stations,
            { stationId, accessType, time: parseInt(time) },
        ]);
        onChange([
            ...stations,
            { stationId, accessType, time: parseInt(time) },
        ]);

        await onAddHotelStation({
            stationId,
            accessType,
            time: parseInt(time),
        });
    };

    const onRemove = useCallback(
        (station) => {
            onRemoveStation(station);
        },
        [onRemoveStation]
    );
    useEffect(() => {
        if (defaultValues?.length > 0) {
            const defVals = defaultValues.map((item) => ({
                isDefault: true,
                stationId: item.station.id,
                accessType: item.accessType,
                time: item.time,
                ...item,
            }));
            setStations(defVals);
            return;
        }
        setStations([]);
    }, [defaultValues?.length]);
    return (
        <div className="w-full">
            <div className="mb-3 w-full">
                {stations?.map((station, index) => {
                    return (
                        <StationItem
                            key={index}
                            station={station}
                            onRemoveStation={onRemove}
                        />
                    );
                })}
                {!toggleForm && stations?.length < 1 ? (
                    <p className="text-sm text-center text-gray-800">
                        No Nearest station added yet. Please in below button to
                        add new station
                    </p>
                ) : null}
            </div>

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
});
export default HotelNearestStation;
