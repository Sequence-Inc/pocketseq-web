import { Select, TextField } from "@element";
import useAddSpace from "@hooks/useAddSpace";
import React from "react";
import { Controller } from "react-hook-form";

const HostSpace = ({ register, control, errors, loading }) => {
    const { spaceTypes } = useAddSpace();

    return (
        <>
            <div className="">
                <TextField
                    {...register("name", {
                        required: true,
                    })}
                    label="Name"
                    error={errors.name && true}
                    errorMessage="Name is required"
                    autoFocus
                    disabled={loading}
                    singleRow
                />
            </div>
            <div className="">
                <TextField
                    {...register("maximumCapacity", {
                        required: true,
                        setValueAs: (val) => parseInt(val),
                        min: 0,
                    })}
                    label="Maximum Capacity"
                    error={errors.maximumCapacity && true}
                    errorMessage="Maximum Capacity is required"
                    type="number"
                    disabled={loading}
                    singleRow
                />
            </div>

            <div className="">
                <TextField
                    {...register("numberOfSeats", {
                        required: true,
                        setValueAs: (val) => parseInt(val),
                        min: 0,
                    })}
                    label="Number Of seats"
                    error={errors.numberOfSeats && true}
                    errorMessage="Number Of seats is required"
                    type="number"
                    disabled={loading}
                    singleRow
                />
            </div>

            <div className="">
                <TextField
                    {...register("spaceSize", {
                        required: true,
                        setValueAs: (val) => parseFloat(val),
                        min: 1,
                    })}
                    label="Space Size"
                    error={errors.spaceSize && true}
                    errorMessage="Space Size is required"
                    type="number"
                    disabled={loading}
                    singleRow
                />
            </div>

            <div className="">
                <Controller
                    name="spaceTypes"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            label="Space Types"
                            options={spaceTypes?.allSpaceTypes || []}
                            error={errors.spaceTypes && true}
                            errorMessage="Space Types is required"
                            labelKey="title"
                            valueKey="id"
                            disabled={loading}
                            singleRow
                        />
                    )}
                />
            </div>
        </>
    );
};

export default HostSpace;
