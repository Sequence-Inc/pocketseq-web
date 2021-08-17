import { Button, Container, Select, TextField } from '@element'
import React from 'react'
import HostLayout from 'src/layouts/HostLayout';
import Link from "next/link";
import useAddSpace from '@hooks/useAddSpace';
import { Controller } from 'react-hook-form';

const AddNewSpace = () => {
    const { spaceTypes, register, control, errors, onSubmit, trainLines, getTrainLine, stationId, getStationId } = useAddSpace();

    return (
        <HostLayout>
            <Container className="py-4 sm:py-6 lg:py-8">
                <form onSubmit={onSubmit}>
                    <div className="shadow sm:rounded-md sm:overflow-hidden">
                        <div className="space-y-4 bg-white">
                            <div>
                                <div className="px-4 py-1.5 border border-gray-200 sm:px-6 sm:py-2.5 bg-gray-50">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Space</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        This information will be displayed publicly so be sure to add valid information.
                                    </p>
                                </div>

                                <div className="px-4 py-1.5 sm:px-6 sm:py-2.5 max-w-sm space-y-4">
                                    <div className="">
                                        <TextField
                                            {...register("name", { required: true })}
                                            label="Name"
                                            error={errors.name && true}
                                            errorMessage="Name is required"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="">
                                        <TextField
                                            {...register("maximumCapacity", { required: true, setValueAs: (val) => parseInt(val) })}
                                            label="Maximum Capacity"
                                            error={errors.maximumCapacity && true}
                                            errorMessage="Maximum Capacity is required"
                                            type="number"
                                        />
                                    </div>

                                    <div className="">
                                        <TextField
                                            {...register("numberOfSeats", { required: true, setValueAs: (val) => parseInt(val) })}
                                            label="Number Of seats"
                                            error={errors.numberOfSeats && true}
                                            errorMessage="Number Of seats is required"
                                            type="number"
                                        />
                                    </div>

                                    <div className="">
                                        <TextField
                                            {...register("spaceSize", { required: true, setValueAs: (val) => parseFloat(val) })}
                                            label="Space Size"
                                            error={errors.spaceSize && true}
                                            errorMessage="Space Size is required"
                                            type="number"
                                        />
                                    </div>

                                    <div className="">
                                        <Controller
                                            name="spaceTypes"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => <Select
                                                {...field}
                                                label="Space Types"
                                                options={spaceTypes?.allSpaceTypes || []}
                                                error={errors.spaceTypes && true}
                                                errorMessage="Space Types is required"
                                                labelKey="title"
                                                valueKey="id"
                                            />}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <div className="px-4 py-1.5 border border-gray-200 sm:px-6 sm:py-2.5 bg-gray-50">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Pricing</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Added a pricing plan for your space
                                    </p>
                                </div>
                                <div className="px-4 py-1.5 sm:px-6 sm:py-2.5 max-w-sm space-y-4">
                                    <div className="">
                                        <TextField
                                            {...register("spacePricePlan.planTitle", { required: true })}
                                            label="Plan Title"
                                            error={errors.spacePricePlan?.planTitle && true}
                                            errorMessage="Plan Title is required"
                                        />
                                    </div>

                                    <div className="">
                                        <TextField
                                            {...register("spacePricePlan.hourlyPrice", { required: true, setValueAs: (val) => parseFloat(val) })}
                                            label="Hourly Price"
                                            error={errors.spacePricePlan?.hourlyPrice && true}
                                            errorMessage="Hourly Price is required"
                                            type="number"
                                        />
                                    </div>

                                    <div className="">
                                        <TextField
                                            {...register("spacePricePlan.dailyPrice", { required: true, setValueAs: (val) => parseFloat(val) })}
                                            label="Daily Price"
                                            error={errors.spacePricePlan?.dailyPrice && true}
                                            errorMessage="Daily Price is required"
                                            type="number"
                                        />
                                    </div>

                                    <div className="">
                                        <TextField
                                            {...register("spacePricePlan.maintenanceFee", { required: true, setValueAs: (val) => parseFloat(val) })}
                                            label="Maintenance Fee"
                                            error={errors.spacePricePlan?.maintenanceFee && true}
                                            errorMessage="Maintenance Fee is required"
                                            type="number"
                                        />
                                    </div>

                                    <div className="">
                                        <TextField
                                            {...register("spacePricePlan.lastMinuteDiscount", { required: true, setValueAs: (val) => parseFloat(val) })}
                                            label="LastMinute Discount"
                                            error={errors.spacePricePlan?.lastMinuteDiscount && true}
                                            errorMessage="LastMinute Discount is required"
                                            type="number"
                                        />
                                    </div>

                                    <div className="">
                                        <TextField
                                            {...register("spacePricePlan.cooldownTime", { required: true, setValueAs: (val) => parseInt(val) })}
                                            label="Cooldown Time"
                                            error={errors.spacePricePlan?.cooldownTime && true}
                                            errorMessage="Cooldown Time is required"
                                            type="number"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <div className="px-4 py-1.5 sm:px-6 sm:py-2.5 border border-gray-200 bg-gray-50">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Statiion</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Share the nearest station from your space.
                                    </p>
                                </div>
                                <div className="px-4 py-1.5 sm:px-6 sm:py-2.5 max-w-sm space-y-4">

                                    <div className="">
                                        <Controller
                                            name="nearestStations.prefecture"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => <Select
                                                {...field}
                                                label="Prefecture"
                                                options={['東京']}
                                                error={errors.nearestStations?.prefecture && true}
                                                onChange={getTrainLine}
                                                errorMessage="Prefecture is required"
                                            />}
                                        />
                                    </div>

                                    <div className="">
                                        <Controller
                                            name="nearestStations.trainLine"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => <Select
                                                {...field}
                                                label="Train Line"
                                                options={trainLines}
                                                error={errors.nearestStations?.trainLine && true}
                                                errorMessage="Train Line is required"
                                                onChange={getStationId}
                                                labelKey="name"
                                                valueKey="id"
                                            />}
                                        />
                                    </div>

                                    <div className="">
                                        <Controller
                                            name="nearestStations.stationId"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => <Select
                                                {...field}
                                                label="Station ID"
                                                options={stationId}
                                                error={errors.nearestStations?.stationId && true}
                                                errorMessage="Train Line is required"
                                                labelKey="name"
                                                valueKey="id"
                                            />}
                                        />
                                    </div>

                                    <div className="">

                                        <TextField
                                            {...register("nearestStations.via", { required: true })}
                                            label="Via"
                                            error={errors.nearestStations?.via && true}
                                            errorMessage="Via is required"
                                        />
                                    </div>

                                    <div className="">

                                        <TextField
                                            {...register("nearestStations.time", { required: true, setValueAs: (val) => parseInt(val) })}
                                            label="Time"
                                            error={errors.nearestStations?.time && true}
                                            errorMessage="Time is required"
                                            type="number"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex px-4 py-5 space-x-2 bg-gray-50 sm:px-6">
                            <Button type="submit" variant="primary" className="w-auto px-8">Save</Button>
                            <Link href="/user-host/my-space">
                                <a>
                                    <Button className="w-auto px-8">Cancel</Button>
                                </a>
                            </Link>
                        </div>
                    </div>
                </form>
            </Container>
        </HostLayout>
    )
}

export default AddNewSpace
