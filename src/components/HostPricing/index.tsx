import { TextField } from "@element";
import React from "react";

const HostPricing = ({ register, errors, loading, field, index }) => {
    return (
        <>
            <div className="">
                <TextField
                    {...register(`spacePricePlan[${index}].planTitle`, {
                        required: true,
                    })}
                    defaultValue={`${field.planTitle}`}
                    label="Plan Title"
                    error={errors.spacePricePlan?.planTitle && true}
                    errorMessage="Plan Title is required"
                    disabled={loading}
                    singleRow
                />
            </div>

            <div className="">
                <TextField
                    {...register(`spacePricePlan[${index}].hourlyPrice`, {
                        required: true,
                        setValueAs: (val) => parseFloat(val),
                        min: 0,
                    })}
                    defaultValue={`${field.hourlyPrice}`}
                    label="Hourly Price"
                    error={errors.spacePricePlan?.hourlyPrice && true}
                    errorMessage="Hourly Price is required"
                    type="number"
                    min={1}
                    disabled={loading}
                    singleRow
                />
            </div>

            <div className="">
                <TextField
                    {...register(`spacePricePlan[${index}].dailyPrice`, {
                        required: true,
                        setValueAs: (val) => parseFloat(val),
                        min: 1,
                    })}
                    defaultValue={`${field.dailyPrice}`}
                    label="Daily Price"
                    error={errors.spacePricePlan?.dailyPrice && true}
                    errorMessage="Daily Price is required"
                    type="number"
                    disabled={loading}
                    singleRow
                />
            </div>

            <div className="">
                <TextField
                    {...register(`spacePricePlan[${index}].maintenanceFee`, {
                        required: true,
                        setValueAs: (val) => parseFloat(val),
                        min: 0,
                    })}
                    defaultValue={`${field.maintenanceFee}`}
                    label="Maintenance Fee"
                    error={errors.spacePricePlan?.maintenanceFee && true}
                    errorMessage="Maintenance Fee is required"
                    type="number"
                    disabled={loading}
                    singleRow
                />
            </div>

            <div className="">
                <TextField
                    {...register(
                        `spacePricePlan[${index}].lastMinuteDiscount`,
                        {
                            required: true,
                            setValueAs: (val) => parseFloat(val),
                            min: 0,
                        }
                    )}
                    defaultValue={`${field.lastMinuteDiscount}`}
                    label="LastMinute Discount"
                    error={errors.spacePricePlan?.lastMinuteDiscount && true}
                    errorMessage="LastMinute Discount is required"
                    type="number"
                    disabled={loading}
                    singleRow
                />
            </div>

            <div className="">
                <TextField
                    {...register(`spacePricePlan[${index}].cooldownTime`, {
                        required: true,
                        setValueAs: (val) => parseInt(val),
                        min: 0,
                    })}
                    defaultValue={`${field.cooldownTime}`}
                    label="Cooldown Time"
                    error={errors.spacePricePlan?.cooldownTime && true}
                    errorMessage="Cooldown Time is required"
                    type="number"
                    disabled={loading}
                    singleRow
                />
            </div>
        </>
    );
};

export default HostPricing;
