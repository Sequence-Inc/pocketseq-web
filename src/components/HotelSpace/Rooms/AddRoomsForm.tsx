import React, { useEffect, useRef } from "react";
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

import {
    Controller,
    useFieldArray,
    UseFieldArrayReturn,
    FieldArrayWithId,
} from "react-hook-form";
import { useAddRooms } from "@hooks/useAddHotelSpace";
import { useQuery } from "@apollo/client";
import { PRICING_BY_HOTEL_ID } from "src/apollo/queries/hotel.queries";

import { DAY_OF_WEEK } from "@config";

const BASIC_PIRCING = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface IAddRoomFormProps {
    hotelId: string;
    handleSubmit?: any;
    toggleForm?: any;
}
interface IFields extends FieldArrayWithId {
    dayOfWeek: string;
    priceSchemeId: string;
}

const AddRoomForm = ({
    hotelId,
    handleSubmit,
    toggleForm,
}: IAddRoomFormProps) => {
    const { t } = useTranslation("adminhost");

    const { onSubmit, loading, errors, dirtyFields, control, register } =
        useAddRooms(hotelId, handleSubmit);

    const {
        fields,
        append,
        insert,
        update,
    }: UseFieldArrayReturn & {
        fields: IFields[];
    } = useFieldArray({
        name: "basicPriceSettings",
        control,
    });

    useEffect(() => {
        DAY_OF_WEEK.map((day) =>
            append({ dayOfWeek: day.value, priceSchemeId: null })
        );
    }, []);

    const {
        data: priceSchemes,
        loading: priceSchemeLoading,
        error: priceSchemeError,
    } = useQuery(PRICING_BY_HOTEL_ID, {
        skip: !hotelId,
        variables: { hotelId },
    });

    return (
        <form
            onSubmit={onSubmit}
            id="add-hotel-rooms"
            className="px-2 py-3 space-y-6 sm:py-6"
        >
            <div className="w-full lg:w-6/12 md:w-8/12">
                <p className="text-sm leading-5 font-medium">Room Type Name</p>
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
            <div className="w-full lg:w-6/12 md:w-8/12">
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
            <div className="w-full lg:w-6/12 md:w-8/12">
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
            <div className="w-full lg:w-6/12 md:w-8/12">
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
                            error={errors?.paymentTerm && true}
                            errorMessage="Payment Term is required"
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
            <div className="w-full lg:w-6/12 md:w-8/12">
                <div className="pb-2">
                    <p className="text-lg font-medium leading-6">
                        Maximum Capacity
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row space-x-0 space-y-2 sm:space-x-4 sm:space-y-0 ">
                    <div className="w-full">
                        <Controller
                            name={`maxCapacityAdult`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <>
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
                                        error={errors?.maxCapacityAdult && true}
                                        onChange={(event) => {
                                            field.onChange(event);
                                        }}
                                        valueKey="value"
                                        errorMessage="Adult Capacity is required"
                                        labelKey="label"
                                        disabled={loading}
                                    />
                                </>
                            )}
                        />
                    </div>

                    <div className="w-full">
                        <Controller
                            name={`maxCapacityChild`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <>
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
                                        error={errors?.maxCapacityChild && true}
                                        onChange={(event) => {
                                            field.onChange(event);
                                        }}
                                        errorMessage="Child Capacity is required"
                                        labelKey="label"
                                        valueKey="value"
                                        disabled={loading}
                                    />
                                </>
                            )}
                        />
                    </div>
                </div>
            </div>

            <div className="w-3/12 sm:w-20">
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
            <div className="w-full lg:w-6/12 md:w-8/12 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                    <p className="text-lg font-medium leading-6">
                        Basic Pricing Setting
                    </p>
                    <Button
                        type="button"
                        className=" lg:w-36 bg-indigo-100 text-indigo-700 text-sm leading-5 font-medium"
                    >
                        Pricing Overrides
                    </Button>
                </div>
                {priceSchemes?.myPriceSchemes?.length < 1 && (
                    <p className="space-y-3  text-base font-semibold text-center leading-10 mt-4 text-gray-400">
                        Add pricing schemes first (on next page)
                    </p>
                )}
                {priceSchemes?.myPriceSchemes?.length > 0 && (
                    <div className="flex flex-wrap space-y-3 lg:space-y-0 ">
                        {DAY_OF_WEEK.map((pricing, index) => (
                            <div
                                className="flex w-full sm:w-20 py-2  flex-row items-center justify-between lg:flex-1 lg:flex-col lg:justify-between lg:items-center lg:border first:rounded-l-md last:rounded-r-md "
                                key={index}
                            >
                                <p className="text-xl">{pricing.name}</p>
                                <Controller
                                    name={`basicPriceSettings.${index}`}
                                    control={control}
                                    rules={{ required: false }}
                                    // defaultValue={
                                    //     initialValue?.address?.Prefecture?.id
                                    // }
                                    render={({ field }) => {
                                        return (
                                            <Select
                                                // {...field}

                                                hidePlaceholder
                                                label={""}
                                                className="lg:w-16"
                                                options={
                                                    priceSchemes?.myPriceSchemes ||
                                                    []
                                                }
                                                error={
                                                    errors?.prefecture && true
                                                }
                                                onChange={(event) => {
                                                    field.onChange({
                                                        dayOfWeek:
                                                            pricing.value,
                                                        priceSchemeId: event,
                                                    });
                                                    update(index, {
                                                        dayOfWeek:
                                                            pricing.value,
                                                        priceSchemeId: event,
                                                    });
                                                }}
                                                value={
                                                    fields[index]?.priceSchemeId
                                                }
                                                errorMessage="Prefecture is required"
                                                labelKey="name"
                                                valueKey="id"
                                                disabled={
                                                    loading ||
                                                    priceSchemeLoading ||
                                                    !priceSchemes
                                                        ?.myPriceSchemes?.length
                                                }
                                            />
                                        );
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
                    onClick={toggleForm}
                    className="font-medium border-l text-sm w-16"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
};

export default AddRoomForm;
