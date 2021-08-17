import { Button, Container, Select, TextField } from "@element";
import React from "react";
import HostLayout from "src/layouts/HostLayout";
import Link from "next/link";
import useAddSpace from "@hooks/useAddSpace";
import { Controller } from "react-hook-form";
import { useQuery } from "@apollo/client";
import { GET_PREFECTURE } from "src/apollo/queries/space.queries";
import ConfirmModal from "src/elements/ConfirmModal";

const AddNewSpace = () => {
    const {
        spaceTypes,
        register,
        control,
        errors,
        onSubmit,
        trainLines,
        getTrainLine,
        stationId,
        getStationId,
        loading,
        confirmRef
    } = useAddSpace();
    const { data: prefectures } = useQuery(GET_PREFECTURE);

    return (
        <HostLayout>
            <ConfirmModal ref={confirmRef} redirect="/user-host/my-space" />
            <Container className="py-4 sm:py-6 lg:py-8">
                <form onSubmit={onSubmit}>
                    <div className="shadow sm:rounded-md sm:overflow-hidden">
                        <div className="space-y-4 bg-white">
                            <div>
                                <div className="px-4 py-2 border-b border-gray-200 sm:px-6 sm:py-5 bg-gray-50">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        Space
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        This information will be displayed
                                        publicly so be sure to add valid
                                        information.
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
                                                setValueAs: (val) =>
                                                    parseInt(val),
                                            })}
                                            label="Maximum Capacity"
                                            error={
                                                errors.maximumCapacity && true
                                            }
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
                                                setValueAs: (val) =>
                                                    parseInt(val),
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
                                                setValueAs: (val) =>
                                                    parseFloat(val),
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
                                                    options={
                                                        spaceTypes?.allSpaceTypes ||
                                                        []
                                                    }
                                                    error={
                                                        errors.spaceTypes &&
                                                        true
                                                    }
                                                    errorMessage="Space Types is required"
                                                    labelKey="title"
                                                    valueKey="id"
                                                    disabled={loading}
                                                    singleRow
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="px-4 py-2 border-t border-b border-gray-200 sm:px-6 sm:py-5 bg-gray-50">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        Pricing
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Added a pricing plan for your space
                                    </p>
                                </div>
                                <div className="px-4 py-2 space-y-4 sm:px-6 sm:py-6">
                                    <div className="">
                                        <TextField
                                            {...register(
                                                "spacePricePlan.planTitle",
                                                { required: true }
                                            )}
                                            label="Plan Title"
                                            error={
                                                errors.spacePricePlan
                                                    ?.planTitle && true
                                            }
                                            errorMessage="Plan Title is required"
                                            disabled={loading}
                                            singleRow
                                        />
                                    </div>

                                    <div className="">
                                        <TextField
                                            {...register(
                                                "spacePricePlan.hourlyPrice",
                                                {
                                                    required: true,
                                                    setValueAs: (val) =>
                                                        parseFloat(val),
                                                }
                                            )}
                                            label="Hourly Price"
                                            error={
                                                errors.spacePricePlan
                                                    ?.hourlyPrice && true
                                            }
                                            errorMessage="Hourly Price is required"
                                            type="number"
                                            disabled={loading}
                                            singleRow
                                        />
                                    </div>

                                    <div className="">
                                        <TextField
                                            {...register(
                                                "spacePricePlan.dailyPrice",
                                                {
                                                    required: true,
                                                    setValueAs: (val) =>
                                                        parseFloat(val),
                                                }
                                            )}
                                            label="Daily Price"
                                            error={
                                                errors.spacePricePlan
                                                    ?.dailyPrice && true
                                            }
                                            errorMessage="Daily Price is required"
                                            type="number"
                                            disabled={loading}
                                            singleRow
                                        />
                                    </div>

                                    <div className="">
                                        <TextField
                                            {...register(
                                                "spacePricePlan.maintenanceFee",
                                                {
                                                    required: true,
                                                    setValueAs: (val) =>
                                                        parseFloat(val),
                                                }
                                            )}
                                            label="Maintenance Fee"
                                            error={
                                                errors.spacePricePlan
                                                    ?.maintenanceFee && true
                                            }
                                            errorMessage="Maintenance Fee is required"
                                            type="number"
                                            disabled={loading}
                                            singleRow
                                        />
                                    </div>

                                    <div className="">
                                        <TextField
                                            {...register(
                                                "spacePricePlan.lastMinuteDiscount",
                                                {
                                                    required: true,
                                                    setValueAs: (val) =>
                                                        parseFloat(val),
                                                }
                                            )}
                                            label="LastMinute Discount"
                                            error={
                                                errors.spacePricePlan
                                                    ?.lastMinuteDiscount && true
                                            }
                                            errorMessage="LastMinute Discount is required"
                                            type="number"
                                            disabled={loading}
                                            singleRow
                                        />
                                    </div>

                                    <div className="">
                                        <TextField
                                            {...register(
                                                "spacePricePlan.cooldownTime",
                                                {
                                                    required: true,
                                                    setValueAs: (val) =>
                                                        parseInt(val),
                                                }
                                            )}
                                            label="Cooldown Time"
                                            error={
                                                errors.spacePricePlan
                                                    ?.cooldownTime && true
                                            }
                                            errorMessage="Cooldown Time is required"
                                            type="number"
                                            disabled={loading}
                                            singleRow
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="px-4 py-2 border-t border-b border-gray-200 sm:px-6 sm:py-5 bg-gray-50">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        Statiion
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Share the nearest station from your
                                        space.
                                    </p>
                                </div>
                                <div className="px-4 py-2 space-y-4 sm:px-6 sm:py-6">
                                    {console.log(prefectures?.prefectures)}
                                    <div className="">
                                        <Controller
                                            name="prefecture"
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
                                                    onChange={(event) => { field.onChange(event); getTrainLine(); }}
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
                                            name="trainLine"
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
                                                    onChange={(event) => { field.onChange(event); getStationId(); }}
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
                                            name="nearestStations.stationId"
                                            control={control}
                                            rules={{ required: true }}
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
                                                "nearestStations.via",
                                                { required: true }
                                            )}
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
                                                "nearestStations.time",
                                                {
                                                    required: true,
                                                    setValueAs: (val) =>
                                                        parseInt(val),
                                                }
                                            )}
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
                                </div>
                            </div>
                        </div>

                        <div className="flex px-4 py-5 space-x-2 bg-gray-50 sm:px-6">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-auto px-8"
                                loading={loading}
                            >
                                Save
                            </Button>
                            <Link href="/user-host/my-space">
                                <a>
                                    <Button className="w-auto px-8" disabled={loading}>
                                        Cancel
                                    </Button>
                                </a>
                            </Link>
                        </div>
                    </div>
                </form>
            </Container>
        </HostLayout>
    );
};

export default AddNewSpace;
