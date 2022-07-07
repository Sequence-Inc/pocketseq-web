import React from "react";
import {
    FileUpload,
    TextArea,
    TextField,
    Select,
    Button,
    RadioField,
} from "@element";
import useTranslation from "next-translate/useTranslation";

import { TAddHotelProps } from "@appTypes/timebookTypes";

import { Controller } from "react-hook-form";
import { useAddRooms } from "@hooks/useAddHotelSpace";

const BASIC_PIRCING = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface IAddRoomFormProps {
    hotelId: string;
}

const AddRoomForm = ({ hotelId }: IAddRoomFormProps) => {
    const { t } = useTranslation("adminhost");
    console.log("hotel id in room form", hotelId);
    const { onSubmit, loading, reset, errors, watch, control, register } =
        useAddRooms(hotelId);

    return (
        <form onSubmit={onSubmit} id="add-hotel-rooms">
            <div className="px-0 py-3 space-y-6 sm:py-6">
                <div className="lg:w-6/12 md:w-3/4 sm:w-full">
                    <p className="text-sm leading-5 font-medium">{t("name")}</p>
                    <TextField
                        label={""}
                        {...register("name", {
                            required: true,
                        })}
                        error={errors.name && true}
                        errorMessage="Name is required"
                        autoFocus
                        disabled={loading}
                    />
                </div>
                <div className="lg:w-6/12 md:w-3/4 sm:w-full">
                    <p className="text-sm leading-5 font-medium">Description</p>
                    <TextArea
                        label=""
                        {...register("description", {
                            required: true,
                        })}
                        errorMessage="Description is required"
                        autoFocus
                        error={errors.description && true}
                        rows={3}
                        disabled={loading}
                    />
                </div>
                <div className="lg:w-6/12 md:w-6/12 sm:w-full">
                    <div className="pb-2">
                        <h3 className="font-medium text-lg text-gray-900">
                            Photos
                        </h3>
                        <p className="text-gray-500">
                            この情報は情報は一般に公開されますので、必ず有効な情報を追加してください。
                        </p>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">
                        Upload Photos
                    </p>

                    <Controller
                        rules={{ required: true }}
                        control={control}
                        name="photos"
                        render={({ field: { onChange } }) => (
                            <FileUpload
                                id="room_form"
                                hideLabel
                                className="w-full"
                                label=""
                                error={errors.photos && true}
                                errorMessage="Photos are required"
                                onChange={(e) => onChange(e)}
                            />
                        )}
                    />
                </div>
                <div className="max-w-screen-sm">
                    <div className="pb-2">
                        <p className="text-lg font-medium leading-6">
                            Payment Terms
                        </p>
                    </div>
                    <Controller
                        rules={{ required: true }}
                        control={control}
                        name="paymentTerm"
                        render={({ field: { onChange } }) => (
                            <RadioField
                                label=""
                                disabled={loading}
                                onChange={(e) => onChange(e)}
                                options={[
                                    {
                                        value: "PER_ROOM",
                                        label: "Per Room Basis",
                                    },
                                    {
                                        value: "PER_PERSON",
                                        label: "Per Person Basis",
                                    },
                                ]}
                            />
                        )}
                    />
                </div>
                <div className="w-6/12">
                    <div className="pb-2">
                        <p className="text-lg font-medium leading-6">
                            Maximum Capacity
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <div className=" lg:w-6/12">
                            <Controller
                                name={`maxCapacityAdult`}
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <div>
                                        <p className="text-sm leading-5 font-medium text-gray-700">
                                            Adult
                                        </p>
                                        <Select
                                            {...field}
                                            label={""}
                                            options={Array.from(Array(11)).map(
                                                (_, i) => ({
                                                    value: i,
                                                    label: i,
                                                })
                                            )}
                                            error={
                                                errors?.maxCapacityChild && true
                                            }
                                            onChange={(event) => {
                                                field.onChange(event);
                                            }}
                                            valueKey="value"
                                            errorMessage="Adult Capacity is required"
                                            labelKey="label"
                                            disabled={loading}
                                        />
                                    </div>
                                )}
                            />
                        </div>

                        <div className="lg:w-6/12">
                            <Controller
                                name={`maxCapacityChild`}
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <div>
                                        <p className="text-sm leading-5 font-medium text-gray-700">
                                            Child
                                        </p>
                                        <Select
                                            {...field}
                                            label={""}
                                            options={Array.from(Array(11)).map(
                                                (_, i) => ({
                                                    value: i,
                                                    label: i,
                                                })
                                            )}
                                            error={
                                                errors?.maxCapacityChild && true
                                            }
                                            onChange={(event) => {
                                                field.onChange(event);
                                            }}
                                            errorMessage="Child Capacity is required"
                                            labelKey="label"
                                            valueKey="value"
                                            disabled={loading}
                                        />
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className=" w-1/12">
                    <div className="pb-2">
                        <p className="text-lg font-medium leading-6">Stock</p>
                    </div>
                    <TextField
                        label=""
                        {...register("stock", {
                            required: true,
                        })}
                        errorMessage="Stock is required"
                        autoFocus
                        error={errors.stock && true}
                        type="number"
                        disabled={loading}
                    />
                </div>
                {/* <div className="sm:w-6/12">
                    <div className="flex justify-between items-center pb-4">
                        <p className="text-lg font-medium leading-6">
                            Basic Pricing Setting
                        </p>
                        <Button
                            type="button"
                            className="w-36 bg-indigo-100 text-indigo-700 text-sm leading-5 font-medium"
                        >
                            Pricing Overrides
                        </Button>
                    </div>
                    <div className="grid grid-cols-7">
                        {BASIC_PIRCING.map((pricing, index) => (
                            <div
                                className="flex flex-col border text-center first:rounded-l-md last:rounded-r-md px-2 py-2"
                                key={index}
                            >
                                <p className=" text-xl">{pricing}</p>
                                <Controller
                                    name={`Adult`}
                                    control={control}
                                    rules={{ required: true }}
                                    // defaultValue={
                                    //     initialValue?.address?.Prefecture?.id
                                    // }
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            label={""}
                                            options={
                                                // prefectures?.availablePrefectures ||
                                                []
                                            }
                                            // error={errors?.prefecture && true}
                                            onChange={(event) => {
                                                field.onChange(event);
                                            }}
                                            errorMessage="Prefecture is required"
                                            labelKey="name"
                                            valueKey="id"
                                            // disabled={loading}
                                        />
                                    )}
                                />
                            </div>
                        ))}
                    </div>
                </div> */}

                <div className="flex justify-end space-x-3 border-t mt-4 pt-5 lg:w-6/12 md:w-8/12 sm:w-6/12  ">
                    <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                        loadingText="Adding Room"
                        className="bg-indigo-600 font-medium text-sm w-16 hover:bg-indigo-400"
                    >
                        Save
                    </Button>
                    <Button
                        type="button"
                        variant="white"
                        disabled={loading}
                        className="font-medium border-l text-sm w-16"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default AddRoomForm;
