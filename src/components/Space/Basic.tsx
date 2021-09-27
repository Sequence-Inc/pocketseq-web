import React from "react";
import { Button, Select, TextField } from "@element";
import useAddSpace, { useBasicSpace } from "@hooks/useAddSpace";
import { Controller } from "react-hook-form";
import { useEffect } from "react";
import axios from "axios";
import { normalizeZipCodeInput } from "src/utils/normalizeZipCode";

const Basic = ({ activeStep, setActiveStep, steps }) => {
    const { spaceTypes } = useAddSpace();
    const {
        prefectures,
        loading,
        zipCode,
        setZipCode,
        cache,
        setCache,
        register,
        control,
        errors,
        watch,
        setValue,
        onSubmit,
    } = useBasicSpace(handleNext);

    const hasPrevious: boolean = activeStep > 0 && true;
    const hasNext: boolean = activeStep < steps.length - 1 && true;

    const handlePrevious = (): void => {
        if (hasPrevious) setActiveStep(activeStep - 1);
    };

    function handleNext(): void {
        if (hasNext) setActiveStep(activeStep + 1);
    }

    useEffect(() => {
        console.log("YO!", watch().zipCode);
        const api = async () => {
            const newZipCode = normalizeZipCodeInput(watch().zipCode, zipCode);
            setZipCode(newZipCode);
            if (newZipCode?.length === 3) {
                const prefix = newZipCode;
                // check if prefix already has the data
                if (!cache[prefix]) {
                    // fetch data
                    console.log("fetching data from web for", prefix);
                    const { data } = await axios.get(
                        "https://yubinbango.github.io/yubinbango-data/data/" +
                            prefix +
                            ".js"
                    );
                    const newCache = { ...cache };
                    newCache[prefix] = JSON.parse(
                        data.trim().slice(7, data.length - 3)
                    );
                    setCache(newCache);
                }
            } else if (newZipCode?.length === 7) {
                const tempCode: string = newZipCode.substring(0, 3);
                const prefix: string = tempCode;
                const fullZipCode = newZipCode;
                const address = cache[prefix]
                    ? cache[prefix][fullZipCode]
                    : null;
                if (address) {
                    setValue("prefecture", address[0], { shouldDirty: true });
                    setValue("city", address[1]);
                    setValue("addressLine1", address[2]);
                    setValue("addressLine2", address[3]);
                }
            }
        };
        watch().zipCode && api();
    }, [watch().zipCode]);

    return (
        <form onSubmit={onSubmit}>
            <div className="px-4 py-2 border-b border-gray-200 sm:px-6 sm:py-5 bg-gray-50">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Space
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    This information will be displayed publicly so be sure to
                    add valid information.
                </p>
            </div>
            <div className="px-4 py-2 space-y-4 sm:px-6 sm:py-6">
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
                                options={spaceTypes?.availableSpaceTypes || []}
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
                <div className="">
                    <TextField
                        {...register("zipCode", {
                            required: true,
                        })}
                        label="Postal code"
                        error={errors.zipCode && true}
                        errorMessage="Zip Code is required"
                        disabled={loading}
                        singleRow
                    />
                </div>
                <div className="">
                    <Controller
                        name={`prefecture`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                label="Prefecture"
                                options={
                                    prefectures?.availablePrefectures || []
                                }
                                error={errors?.prefecture && true}
                                onChange={(event) => {
                                    field.onChange(event);
                                }}
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
                    <TextField
                        {...register("city", {
                            required: true,
                        })}
                        label="City"
                        error={errors.zipCode && true}
                        errorMessage="City is required"
                        disabled={loading}
                        singleRow
                    />
                </div>
                <div className="">
                    <TextField
                        {...register("addressLine1", {
                            required: true,
                        })}
                        label="Address Line 1"
                        error={errors.zipCode && true}
                        errorMessage="Address Line 1 is required"
                        disabled={loading}
                        singleRow
                    />
                </div>
                <div className="">
                    <TextField
                        {...register("addressLine2", {
                            required: true,
                        })}
                        label="Address Line 2"
                        error={errors.zipCode && true}
                        errorMessage="Address Line 2 is required"
                        disabled={loading}
                        singleRow
                    />
                </div>
            </div>
            <div className="flex justify-between px-4 py-5 bg-gray-50 sm:px-6">
                <Button
                    className="w-auto px-8"
                    disabled={loading || !hasPrevious}
                    onClick={handlePrevious}
                >
                    previous
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    className="w-auto px-8"
                    loading={loading}
                >
                    {hasNext ? "Next" : "Save"}
                </Button>
            </div>
        </form>
    );
};

export default Basic;
