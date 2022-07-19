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
import { PRICING_BY_HOTEL_ID } from "src/apollo/queries/hotel.queries";
import { Controller, FieldArrayWithId } from "react-hook-form";
import { useAddPlans } from "@hooks/useAddHotelSpace";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import moment from "moment";
import { useQuery } from "@apollo/client";
import { DAY_OF_WEEK } from "@config";
import { ErrorMessage } from "@hookform/error-message";
import { LoadingSpinner } from "../../LoadingSpinner";
import { useToast } from "@hooks/useToasts";

const timeFormat = "HH:mm a";
const dateFormat = "YYYY-MM-DD";

type PRICE_SETTINGS = {
    dayOfWeek: string;
    priceSchemeId?: string;
};
interface IFields extends FieldArrayWithId {
    hotelRoomId: string;
    priceSettings: PRICE_SETTINGS[];
}
interface IPlanFormProps extends TAddHotelProps {
    hotelId: string;
    toggleForm: any;
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
    const { hotelId, toggleForm } = props;

    const { addAlert } = useToast();

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
        handleRoomTypesChange,
        fields: roomTypeFields,
        handleRoomFieldUpdate,
        onSubmit,
    } = useAddPlans({
        hotelId,
        addAlert,
    });

    const {
        data: priceSchemes,
        loading: priceSchemeLoading,
        error: priceSchemeError,
    } = useQuery(PRICING_BY_HOTEL_ID, {
        skip: !hotelId,
        variables: { hotelId },
    });

    const { t } = useTranslation("adminhost");

    return (
        <>
            <form className="px-2" onSubmit={onSubmit}>
                <div className="px-0 py-3 space-y-6 sm:py-6">
                    <div className="lg:w-6/12 md:w-3/4 sm:w-full">
                        <p className="text-sm leading-5 font-medium">
                            Plan Name
                        </p>
                        <TextField
                            label={""}
                            errorMessage="Name is required"
                            autoFocus
                            {...register("name", {
                                required: true,
                            })}
                            error={errors.name && true}
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
                            error={errors.description && true}
                            {...register("description", {
                                required: true,
                            })}
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
                                    error={errors.startUsage && true}
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
                                    error={errors.endUsage && true}
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
                                    error={errors.startReservation && true}
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
                                    error={errors.endReservation && true}
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
                                        error={errors.cutOffBeforeDays && true}
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
                                                    errors.cutOffTillTime &&
                                                    true
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
                    <div className="lg:w-8/12 md:w-3/4 sm:w-full flex flex-col space-y-3">
                        <div className="pb-2 flex space-x-4 ">
                            <div>
                                <h3 className="font-medium text-lg text-gray-900">
                                    Room Types
                                </h3>
                                <p className="text-gray-500">
                                    このプランに付いてる部屋を選択してください。
                                </p>
                            </div>

                            {errors?.roomTypes && (
                                <div className="flex items-center pr-3 pointer-events-none">
                                    <ExclamationCircleIcon
                                        className="w-5 h-5 text-red-400"
                                        aria-hidden="true"
                                    />
                                    <span className="text-sm text-red-500">
                                        {errors?.roomTypes?.message}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                            {!hotelRooms?.myHotelRooms?.length ? (
                                <span className="text-base  font-semibold text-gray-700 ">
                                    Rooms are not added yet. Please add them
                                    first.
                                </span>
                            ) : (
                                ""
                            )}

                            {hotelRooms?.myHotelRooms?.map(
                                (room, index) => {
                                    const fieldIndex = roomTypeFields.findIndex(
                                        (item: IFields) =>
                                            item?.hotelRoomId === room.id
                                    );

                                    const singleRoomType =
                                        roomTypeFields[fieldIndex];

                                    let priceSettings;

                                    if (singleRoomType) {
                                        priceSettings =
                                            singleRoomType?.priceSettings;
                                    }

                                    // const priceSett;

                                    return (
                                        <div className=" space-y-4" key={index}>
                                            <div className="flex w-full items-center space-x-3">
                                                <input
                                                    id="comments"
                                                    aria-describedby="comments-description"
                                                    name="comments"
                                                    type="checkbox"
                                                    onChange={(e) =>
                                                        handleRoomTypesChange(
                                                            room.id,
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                />
                                                <p className="text-sm leading-4 font-medium">
                                                    {room?.name}
                                                </p>
                                            </div>
                                            {fieldIndex >= 0 && (
                                                <div className="w-full">
                                                    {priceSchemes
                                                        ?.myPriceSchemes
                                                        ?.length > 0 && (
                                                        <div className="flex flex-wrap">
                                                            {DAY_OF_WEEK.map(
                                                                (
                                                                    day,
                                                                    dayIndex
                                                                ) => (
                                                                    <div
                                                                        className="flex w-full sm:w-20 py-2  flex-row items-center justify-between lg:flex-1 lg:flex-col lg:justify-between lg:items-center lg:border first:rounded-l-md last:rounded-r-md "
                                                                        key={
                                                                            dayIndex
                                                                        }
                                                                    >
                                                                        <p>
                                                                            {
                                                                                day.name
                                                                            }
                                                                        </p>
                                                                        <Select
                                                                            hidePlaceholder
                                                                            label={
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                val
                                                                            ) => {
                                                                                handleRoomFieldUpdate(
                                                                                    fieldIndex,
                                                                                    dayIndex,
                                                                                    val
                                                                                );
                                                                            }}
                                                                            className="lg:w-16"
                                                                            options={
                                                                                priceSchemes?.myPriceSchemes ||
                                                                                []
                                                                            }
                                                                            labelKey="name"
                                                                            valueKey="id"
                                                                            value={
                                                                                priceSettings?.length >
                                                                                0
                                                                                    ? priceSettings[
                                                                                          dayIndex
                                                                                      ]
                                                                                          ?.priceSchemeId
                                                                                    : ""
                                                                            }
                                                                        />
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                                // />
                            )}
                        </div>
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
                        />
                    </div>
                    {/* <div className="lg:w-6/12 md:w-3/4 sm:w-full flex flex-col space-y-2">
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
                        {...register("options")}
                            className="w-80"
                            value=""
                            onChange={() => {}}
                            options={[]}
                            label=""
                        />
                    </div> */}

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
                            onClick={toggleForm}
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