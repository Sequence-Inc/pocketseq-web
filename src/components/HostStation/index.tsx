import { Select, TextField } from '@element';
import useAddSpace from '@hooks/useAddSpace';
import React from 'react'
import { Controller } from 'react-hook-form';
import { useQuery } from "@apollo/client";
import { GET_PREFECTURE } from "src/apollo/queries/space.queries";

const HostStation = ({ register, control, errors, loading, field, index }) => {
    const { trainLines,
        getTrainLine,
        stationId,
        getStationId } = useAddSpace();
    const { data: prefectures } = useQuery(GET_PREFECTURE);

    return (
        <>
            <div className="">
                <Controller
                    name={`nearestStations[${index}].prefecture`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            label="Prefecture"
                            options={prefectures?.prefectures || []}
                            error={
                                errors?.prefecture && true
                            }
                            onChange={(event) => { field.onChange(event); getTrainLine(event); }}
                            errorMessage="Prefecture is required"
                            labelKey="name"
                            valueKey="id"
                            disabled={loading}
                            singleRow
                        />
                    )}
                />
            </div>

            <div className="">
                <Controller
                    name={`nearestStations[${index}].trainLine`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            label="Train Line"
                            options={trainLines?.linesByPrefecture || []}
                            error={
                                errors?.trainLine && true
                            }
                            errorMessage="Train Line is required"
                            onChange={(event) => { field.onChange(event); getStationId(event); }}
                            labelKey="name"
                            valueKey="id"
                            disabled={loading}
                            singleRow
                        />
                    )}
                />
            </div>

            <div className="">
                <Controller
                    name={`nearestStations[${index}].stationId`}
                    control={control}
                    rules={{ required: true }}
                    defaultValue={`${field.stationId}`}
                    render={({ field }) => (
                        <Select
                            {...field}
                            label="Station ID"
                            options={stationId?.stationsByLine || []}
                            error={
                                errors.nearestStations
                                    ?.stationId && true
                            }
                            errorMessage="Train Line is required"
                            labelKey="stationName"
                            valueKey="id"
                            disabled={loading}
                            singleRow
                        />
                    )}
                />
            </div>

            <div className="">
                <TextField
                    {...register(
                        `nearestStations[${index}].via`,
                        { required: true }
                    )}
                    defaultValue={`${field.via}`}
                    label="Via"
                    error={
                        errors.nearestStations?.via &&
                        true
                    }
                    errorMessage="Via is required"
                    disabled={loading}
                    singleRow
                />
            </div>

            <div className="">
                <TextField
                    {...register(
                        `nearestStations[${index}].time`,
                        {
                            required: true,
                            setValueAs: (val) =>
                                parseInt(val),
                        }
                    )}
                    defaultValue={`${field.time}`}
                    label="Time"
                    error={
                        errors.nearestStations?.time &&
                        true
                    }
                    errorMessage="Time is required"
                    type="number"
                    disabled={loading}
                    singleRow
                />
            </div>
        </>
    )
}

export default HostStation;