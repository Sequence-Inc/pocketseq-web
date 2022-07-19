import React from "react";
import {
    FileUpload,
    TextArea,
    TextField,
    TimePickerField,
    Select,
    Button,
    SwitchField,
    DatePickerField,
    RadioField,
} from "@element";
import useTranslation from "next-translate/useTranslation";
import { TAddHotelProps } from "@appTypes/timebookTypes";

import { Controller } from "react-hook-form";
import { useAddPlans } from "@hooks/useAddHotelSpace";
import moment from "moment";

const timeFormat = "HH:mm a";
const dateFormat = "YYYY-MM-DD";

interface IPlanFormProps extends TAddHotelProps {
    hotelId: string;
}

const ROOM_TYPES = [
    { value: "Suit", label: "Suit" },
    {
        value: "Premium Double Room",
        label: "Premium Double Room",
    },
    {
        value: "Standard Single Room",
        label: "Standard Single Room",
    },
];
const BASIC_PIRCING = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PAYMENT_TYPES = [
    {
        value: "PER_ROOM",
        label: "Per Room Basis",
    },
    {
        value: "PER_PERSON",
        label: "Per Person Basis",
    },
];

const Plans = (props: IPlanFormProps) => {
    const { hotelId } = props;
    const {
        hotelRooms,
        refetchRooms,
        fetchRoomErrors,
        watchShowUsage,
        register,
        setValue,
        watchShowReservation,
        watchShowCutOff,
        getValues,
        control,
        errors,
    } = useAddPlans({
        hotelId,
    });
    const { t } = useTranslation("adminhost");

    return (
        <>
            <form className="px-2">
                <div className="px-0 py-3 space-y-6 sm:py-6">
                    <div className="lg:w-6/12 md:w-3/4 sm:w-full">
                        <p className="text-sm leading-5 font-medium">
                            Plan Name
                        </p>
                        <TextField
                            label={""}
                            errorMessage="Name is required"
                            autoFocus
                            {...register("name")}
                        />
                    </div>
                    <div className="lg:w-6/12 md:w-3/4 sm:w-full">
                        <p className="text-sm leading-5 font-medium">
                            Description
                        </p>
                        <TextArea
                            label=""
                            errorMessage="Description is required"
                            autoFocus
                            rows={3}
                            {...register("description")}
                        />
                    </div>

                    <div className="lg:w-6/12 md:w-3/4 sm:w-full flex flex-col space-y-2">
                        <SwitchField
                            label={
                                <>
                                    <span className="text-sm leading-5 font-medium">
                                        Usage Period
                                    </span>
                                </>
                            }
                            onChange={(val) => setValue("usagePeriod", val)}
                        />
                        {watchShowUsage && (
                            <div className="flex space-x-2">
                                <DatePickerField
                                    onChange={(val) => {
                                        setValue(
                                            "startUsage",
                                            moment(val).format(dateFormat)
                                        );
                                    }}
                                    className="sm:space-x-0 flex items-center flex-row-reverse space-x-2 "
                                    label="from"
                                    labelClassName=" ml-2 font-medium "
                                    value={
                                        getValues("startUsage") &&
                                        moment(
                                            getValues("startUsage"),
                                            dateFormat
                                        )
                                    }
                                />
                                <DatePickerField
                                    className="sm:space-x-0 flex items-center flex-row-reverse space-x-2 "
                                    label="to"
                                    labelClassName=" ml-2 font-medium "
                                    value={
                                        getValues("endUsage") &&
                                        moment(
                                            getValues("endUsage"),
                                            dateFormat
                                        )
                                    }
                                    onChange={(val) => {
                                        setValue(
                                            "endUsage",
                                            moment(val).format(dateFormat)
                                        );
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="lg:w-6/12 md:w-3/4 sm:w-full flex flex-col space-y-2">
                        <SwitchField
                            label={
                                <>
                                    <span className="text-sm leading-5 font-medium">
                                        Reservation Period
                                    </span>
                                </>
                            }
                            onChange={(val) =>
                                setValue("reservationPeriod", val)
                            }
                        />
                        {watchShowReservation && (
                            <div className="flex space-x-2">
                                <DatePickerField
                                    className="sm:space-x-0 flex items-center flex-row-reverse space-x-2 "
                                    label="from"
                                    labelClassName=" ml-2 font-medium "
                                    value={
                                        getValues("startReservation") &&
                                        moment(
                                            getValues("startReservation"),
                                            dateFormat
                                        )
                                    }
                                    onChange={(val) => {
                                        setValue(
                                            "startReservation",
                                            moment(val).format(dateFormat)
                                        );
                                    }}
                                />
                                <DatePickerField
                                    value={
                                        getValues("endReservation") &&
                                        moment(
                                            getValues("endReservation"),
                                            dateFormat
                                        )
                                    }
                                    onChange={(val) => {
                                        setValue(
                                            "endReservation",
                                            moment(val).format(dateFormat)
                                        );
                                    }}
                                    className="sm:space-x-0 flex items-center flex-row-reverse space-x-2 "
                                    label="to"
                                    labelClassName=" ml-2 font-medium "
                                />
                            </div>
                        )}
                    </div>
                    <div className="lg:w-6/12 md:w-3/4 sm:w-full flex flex-col space-y-2">
                        <SwitchField
                            label={
                                <>
                                    <span className="text-sm leading-5 font-medium">
                                        Cut Off Period
                                    </span>
                                </>
                            }
                            onChange={(val) => setValue("cutOffPeriod", val)}
                        />
                        {watchShowCutOff && (
                            <div className="flex space-x-2">
                                <div className="flex items-center  space-x-2 max-w-min">
                                    <TextField
                                        className="flex items-center space-x-2 w-14"
                                        label=""
                                        {...register("cutOffBeforeDays", {
                                            required: watchShowCutOff,
                                            min: 0,
                                            valueAsNumber: true,
                                        })}
                                    />
                                    <p className="text-sm leading-6 font-medium min-w-max">
                                        Days Before
                                    </p>
                                </div>
                                <div className="flex items-center  space-x-2 ">
                                    <Controller
                                        rules={{ required: watchShowCutOff }}
                                        control={control}
                                        name="cutOffTillTime"
                                        render={({ field: { onChange } }) => (
                                            <TimePickerField
                                                label=""
                                                onChange={(e) => {
                                                    onChange(
                                                        e?.format("HH:mm:ss")
                                                    );
                                                }}
                                                error={
                                                    errors.checkInTime && true
                                                }
                                                className=" w-32"
                                                errorMessage="Cut Off time is required"
                                                format={timeFormat}
                                                use12Hours={true}
                                            />
                                        )}
                                    />
                                    <p className="text-sm leading-6 font-medium min-w-max">
                                        Till time
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="lg:w-6/12 md:w-3/4 sm:w-full flex flex-col space-y-2">
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
                                    key="plan_form"
                                    id="plan_form"
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
                    <div className="lg:w-6/12 md:w-3/4 sm:w-full flex flex-col space-y-2">
                        <div className="pb-2">
                            <h3 className="font-medium text-lg text-gray-900">
                                Room Types
                            </h3>
                            <p className="text-gray-500">
                                このプランに付いてる部屋を選択してください。
                            </p>
                        </div>
                        <RadioField
                            label=""
                            onChange={() => {}}
                            options={ROOM_TYPES}
                        />
                    </div>
                    <div className="lg:w-6/12 md:w-3/4 sm:w-full flex flex-col space-y-2">
                        <div className="pb-2">
                            <h3 className="font-medium text-lg text-gray-900">
                                Payment Terms
                            </h3>
                        </div>

                        <Controller
                            rules={{ required: true }}
                            control={control}
                            name="paymentTerm"
                            render={({ field: { onChange } }) => (
                                <RadioField
                                    label=""
                                    onChange={(e) => onChange(e)}
                                    error={errors?.paymentTerm && true}
                                    errorMessage="Payment Term is required"
                                    options={PAYMENT_TYPES}
                                />
                            )}
                        />
                    </div>
                    <div className="lg:w-6/12 md:w-3/4 sm:w-full flex flex-col space-y-2">
                        <div className="pb-2">
                            <h3 className="font-medium text-lg text-gray-900">
                                Stock
                            </h3>
                        </div>
                        <TextField
                            className="w-20"
                            label=""
                            {...register("stock", {
                                required: true,
                            })}
                            errorMessage="Stock is required"
                            autoFocus
                            error={errors.stock && true}
                            type="number"
                        />
                    </div>
                    <div className="lg:w-6/12 md:w-3/4 sm:w-full flex flex-col space-y-2">
                        <div className="flex justify-between items-center pb-4">
                            <p className="text-lg font-medium leading-6">
                                Option Attachment
                            </p>
                            <Button
                                type="button"
                                className="w-36 bg-indigo-100 text-indigo-700 text-sm leading-5 font-medium"
                            >
                                Manage Options
                            </Button>
                        </div>
                        <Select
                            className="w-80"
                            value=""
                            onChange={() => {}}
                            options={[]}
                            label=""
                        />
                    </div>

                    <div className="w-6/12 flex items-center space-x-3 justify-end border-t py-6">
                        <Button
                            variant="primary"
                            className="bg-indigo-600 w-16 hover:bg-indigo-300"
                            type="submit"
                        >
                            Save
                        </Button>
                        <Button
                            variant="secondary"
                            className="w-16"
                            type="button"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default Plans;
