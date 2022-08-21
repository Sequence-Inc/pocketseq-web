import React, { useCallback, useEffect, useState } from "react";
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

import { Controller, FieldArrayWithId } from "react-hook-form";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import moment from "moment";
import { useQuery } from "@apollo/client";
import { DAY_OF_WEEK, PAYMENT_TYPES } from "@config";
import { LoadingSpinner } from "../../LoadingSpinner";
import { useToast } from "@hooks/useToasts";
import { useRouter } from "next/router";
import { usePlans } from "@hooks/host-hotel";
import { Plans as PlanQueries, Pricing } from "src/apollo/queries/hotel";

const { queries: planQueries } = PlanQueries;
const { queries: pricingQueries } = Pricing;

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
    selectedPlan?: any;
    packageLoading?: boolean;
}

const Plans = (props: IPlanFormProps) => {
    const { hotelId, toggleForm, selectedPlan } = props;
    const { addAlert } = useToast();
    const router = useRouter();
    // const {
    //     loading: packageLoading,
    //     data: packageDetails,
    //     error: fetchDetailError,
    //     refetch,
    // } = useQuery(planQueries.PACKAGE_PLAN_BY_ID, {
    //     variables: {
    //         id: selectedPlan,
    //     },
    //     skip: true,
    //     fetchPolicy: "network-only",
    // });

    const onCompleted = useCallback(() => {
        if (!selectedPlan) {
            toggleForm();
        }
    }, [selectedPlan]);

    const {
        initialValue,
        hotelRooms,
        refetchPlanDetail,
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
        loading,
        includedOptions,
        additionalOptions,
        updateRoomPlan,
        onRemovePackagePhotos,
        onAddHotelRoomPhotos,
        handleIncludedOptionFieldChange,
        handleAdditionalOptionFieldChange,
        fetchingPlanDetails,
        cancelPolicies,
        watchSubscriptionPrice,
    } = usePlans({
        hotelId,
        addAlert,
        selectedPlanId: selectedPlan,
        onCompleted,
    });

    const handleUpload = useCallback(
        async (photo) => {
            onAddHotelRoomPhotos(photo)
                .then((data) => {
                    setTimeout(() => {
                        addAlert({
                            type: "success",
                            message: "Added photos successfully",
                        });
                        refetchPlanDetail();
                    }, 5000);
                })
                .catch((err) => {
                    addAlert({
                        type: "error",
                        message: "Could not add photos ",
                    });
                    refetchPlanDetail();
                });
        },
        [onAddHotelRoomPhotos, refetchPlanDetail]
    );

    const {
        data: priceSchemes,
        loading: priceSchemeLoading,
        error: priceSchemeError,
    } = useQuery(pricingQueries.PRICING_BY_HOTEL_ID, {
        skip: !hotelId,
        variables: { hotelId },
    });

    const { t } = useTranslation("adminhost");

    if (selectedPlan && fetchingPlanDetails)
        return <LoadingSpinner loadingText="Loading Plans Data..." />;

    return (
        <>
            <form className="px-2" onSubmit={onSubmit}>
                <div className="px-0 py-3 space-y-6 sm:py-6">
                    <div className="lg:w-6/12 md:w-3/4 sm:w-full">
                        <p className="text-sm leading-5 font-medium">
                            Plan Name
                        </p>
                        <TextField
                            disabled={loading}
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
                            disabled={loading}
                            label=""
                            errorMessage="Description is required"
                            rows={3}
                            error={errors.description && true}
                            {...register("description", {
                                required: true,
                            })}
                        />
                    </div>

                    <div className="lg:w-6/12 md:w-3/4 sm:w-full space-y-2">
                        <p className="text-sm leading-5 font-medium">
                            Cancel Policy
                        </p>
                        <Controller
                            name="cancelPolicyId"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label={""}
                                    options={cancelPolicies || []}
                                    error={errors.cancelPolicyId && true}
                                    errorMessage="Cancel Policy is required"
                                    labelKey="name"
                                    valueKey="id"
                                    disabled={loading}
                                    singleRow
                                />
                            )}
                        />
                    </div>
                    <div className="w-full flex items-center md:w-8/12 lg:w-6/12 space-y-2">
                        <Controller
                            name="isBreakfastIncluded"
                            control={control}
                            rules={{
                                required: false,
                            }}
                            defaultValue={initialValue?.isBreakfastIncluded}
                            render={({ field }) => {
                                return (
                                    <SwitchField
                                        label={
                                            <>
                                                <span className="text-sm leading-5 font-medium">
                                                    Breakfast Included
                                                </span>
                                            </>
                                        }
                                        {...field}
                                        defaultValue={getValues(
                                            "isBreakfastIncluded"
                                        )}
                                        onChange={(val) => field.onChange(val)}
                                        disabled={loading}
                                    />
                                );
                            }}
                        />
                    </div>

                    <div className="lg:w-6/12 md:w-3/4 sm:w-full flex flex-col space-y-2">
                        <SwitchField
                            disabled={loading}
                            label={
                                <>
                                    <span className="text-sm leading-5 font-medium">
                                        Usage Period
                                    </span>
                                </>
                            }
                            defaultValue={getValues("usagePeriod")}
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
                                        moment(getValues("startUsage"))
                                    }
                                />
                                <DatePickerField
                                    disabled={loading}
                                    className="sm:space-x-0 flex items-center flex-row-reverse space-x-2 "
                                    label="to"
                                    labelClassName=" ml-2 font-medium "
                                    value={
                                        getValues("endUsage") &&
                                        moment(getValues("endUsage"))
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
                            disabled={loading}
                            label={
                                <>
                                    <span className="text-sm leading-5 font-medium">
                                        Reservation Period
                                    </span>
                                </>
                            }
                            defaultValue={getValues("reservationPeriod")}
                            onChange={(val) =>
                                setValue("reservationPeriod", val)
                            }
                        />
                        {watchShowReservation && (
                            <div className="flex space-x-2">
                                <DatePickerField
                                    disabled={loading}
                                    className="sm:space-x-0 flex items-center flex-row-reverse space-x-2 "
                                    label="from"
                                    labelClassName=" ml-2 font-medium "
                                    value={
                                        getValues("startReservation") &&
                                        moment(getValues("startReservation"))
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
                                    disabled={loading}
                                    value={
                                        getValues("endReservation") &&
                                        moment(getValues("endReservation"))
                                        // .format(dateFormat)
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
                            defaultValue={getValues("cutOffPeriod")}
                            onChange={(val) => setValue("cutOffPeriod", val)}
                        />
                        {watchShowCutOff && (
                            <div className="flex space-x-2">
                                <div className="flex items-center  space-x-2 max-w-min">
                                    <TextField
                                        disabled={loading}
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
                                                disabled={loading}
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
                                                value={getValues(
                                                    "cutOffTillTime"
                                                )}
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
                            rules={{ required: !initialValue?.photos?.length }}
                            control={control}
                            name="photos"
                            render={({ field: { onChange } }) => (
                                <FileUpload
                                    disabled={loading}
                                    key="plan_form"
                                    id="plan_form"
                                    hideLabel
                                    className="w-full"
                                    label=""
                                    error={errors.photos && true}
                                    defaultPhotos={initialValue?.photos}
                                    errorMessage="Photos are required"
                                    onChange={(e) => onChange(e)}
                                    onRemove={onRemovePackagePhotos}
                                    onUpload={handleUpload}
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

                                    let canBeUpdated = true;

                                    if (initialValue) {
                                        canBeUpdated =
                                            !!initialValue.roomTypes.find(
                                                (item) =>
                                                    item.hotelRoom.id ===
                                                    room.id
                                            );
                                    }

                                    return (
                                        <div className=" space-y-4" key={index}>
                                            <div className="flex w-full items-center space-x-3">
                                                {!initialValue && (
                                                    <input
                                                        id="comments"
                                                        aria-describedby="comments-description"
                                                        name="comments"
                                                        type="checkbox"
                                                        defaultChecked={
                                                            singleRoomType?.isSelected
                                                        }
                                                        disabled={
                                                            loading ||
                                                            !!initialValue
                                                        }
                                                        onChange={(e) =>
                                                            handleRoomTypesChange(
                                                                room.id,
                                                                e.target.checked
                                                            )
                                                        }
                                                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                    />
                                                )}
                                                {canBeUpdated && (
                                                    <p className="text-sm leading-4 font-medium">
                                                        {room?.name}
                                                    </p>
                                                )}
                                            </div>
                                            {fieldIndex >= 0 && (
                                                <div className="w-full flex space-x-3 ">
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
                                                                            disabled={
                                                                                loading
                                                                            }
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
                                                    {singleRoomType?.roomPlanId && (
                                                        <Button
                                                            type="button"
                                                            // /host/hotel-space/edit/[HOTEL_ID]/priceoverride/plan/[PACKAGE_PLAN_ID]/[ROOM_PLAN_ID]
                                                            onClick={() =>
                                                                router.push(
                                                                    `/host/hotel-space/edit/${hotelId}/priceoverride/plan/${initialValue?.id}/${singleRoomType?.roomPlanId}`
                                                                )
                                                            }
                                                            className="w-36 h-10 bg-indigo-100 text-indigo-700 text-sm leading-5 font-medium"
                                                        >
                                                            Plan Overide
                                                        </Button>
                                                    )}
                                                </div>
                                            )}

                                            <div>
                                                {singleRoomType?.isSelected &&
                                                    singleRoomType?.roomPlanId && (
                                                        <Button
                                                            type="button"
                                                            onClick={() =>
                                                                updateRoomPlan(
                                                                    fieldIndex
                                                                )
                                                            }
                                                            className="w-36 bg-indigo-100 text-indigo-700 text-sm leading-5 font-medium"
                                                        >
                                                            Update Plan
                                                        </Button>
                                                    )}
                                            </div>
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
                                    disabled={loading}
                                    label=""
                                    onChange={(e) => onChange(e)}
                                    error={errors?.paymentTerm && true}
                                    errorMessage="Payment Term is required"
                                    options={PAYMENT_TYPES}
                                    defaultValue={getValues("paymentTerm")}
                                />
                            )}
                        />
                    </div>
                    <div className="lg:w-6/12 md:w-3/4 sm:w-full flex flex-col space-y-2">
                        <div className="flex items-center justify-between  pb-2">
                            <h3 className="font-medium text-lg text-gray-900">
                                Stock
                            </h3>
                            <Button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        `/host/hotel-space/edit/${hotelId}/stockoverride/plan/${initialValue?.id}`
                                    )
                                }
                                className="w-36 bg-indigo-100 text-indigo-700 text-sm leading-5 font-medium"
                            >
                                Stock Overide
                            </Button>
                        </div>
                        <TextField
                            disabled={loading}
                            className="w-20"
                            label=""
                            {...register("stock", {
                                required: true,
                                valueAsNumber: true,
                                min: 0,
                            })}
                            errorMessage="Stock is required"
                            type="number"
                            error={errors.stock && true}
                        />
                    </div>
                    <div className="lg:w-6/12 md:w-3/4 sm:w-full flex flex-col space-y-2">
                        <div className="flex justify-between items-center pb-4">
                            <p className="text-lg font-medium leading-6">
                                Included Attachment
                            </p>
                            <Button
                                type="button"
                                className="w-36 bg-indigo-100 text-indigo-700 text-sm leading-5 font-medium"
                            >
                                Manage Options
                            </Button>
                        </div>

                        {includedOptions?.map((option: any, index) => (
                            <div
                                className="flex items-center space-x-4 py-2 "
                                key={index}
                            >
                                <input
                                    id={`options-${option.id}`}
                                    aria-describedby="options-description"
                                    name="option"
                                    type="checkbox"
                                    checked={option?.isChecked}
                                    disabled={loading}
                                    onChange={(e) =>
                                        handleIncludedOptionFieldChange(
                                            index,
                                            e.target.checked
                                        )
                                    }
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />

                                <p className="text-sm leading-4 font-medium">
                                    {option?.name}
                                </p>
                            </div>
                        ))}
                        {errors?.options && (
                            <div className="flex items-center pr-3 pointer-events-none">
                                <ExclamationCircleIcon
                                    className="w-5 h-5 text-red-400"
                                    aria-hidden="true"
                                />
                                <span className="text-sm text-red-500">
                                    {errors?.options?.message}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="lg:w-6/12 md:w-3/4 sm:w-full flex flex-col space-y-2">
                        <div className="flex justify-between items-center pb-4">
                            <p className="text-lg font-medium leading-6">
                                Additional Attachment
                            </p>
                            <Button
                                type="button"
                                className="w-36 bg-indigo-100 text-indigo-700 text-sm leading-5 font-medium"
                            >
                                Manage Options
                            </Button>
                        </div>

                        {additionalOptions?.map((option: any, index) => (
                            <div
                                className="flex items-center space-x-4 py-2 "
                                key={index}
                            >
                                <input
                                    id={`options-${option.id}`}
                                    aria-describedby="options-description"
                                    name="option"
                                    type="checkbox"
                                    checked={option?.isChecked}
                                    disabled={loading}
                                    onChange={(e) =>
                                        handleAdditionalOptionFieldChange(
                                            index,
                                            e.target.checked
                                        )
                                    }
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />

                                <p className="text-sm leading-4 font-medium">
                                    {option?.name}
                                </p>
                            </div>
                        ))}
                        {errors?.options && (
                            <div className="flex items-center pr-3 pointer-events-none">
                                <ExclamationCircleIcon
                                    className="w-5 h-5 text-red-400"
                                    aria-hidden="true"
                                />
                                <span className="text-sm text-red-500">
                                    {errors?.options?.message}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className=" lg:w-6/12 md:w-3/4 sm:w-full  border-t"></div>

                    <div className="lg:w-6/12 md:w-3/4 sm:w-full flex flex-col space-y-2">
                        <SwitchField
                            label={
                                <>
                                    <span className="text-sm leading-5 font-medium">
                                        Subscritpion Price
                                    </span>
                                </>
                            }
                            defaultValue={getValues("subscriptionPriceEnabled")}
                            onChange={(val) =>
                                setValue("subscriptionPriceEnabled", val)
                            }
                        />
                        {watchSubscriptionPrice && (
                            <div className="flex items-center space-x-2 ">
                                <TextField
                                    disabled={loading}
                                    label=""
                                    {...register("subcriptionPrice", {
                                        required: watchSubscriptionPrice,
                                        min: 0,
                                        valueAsNumber: true,
                                    })}
                                    type="number"
                                    placeholder="Subscription Price"
                                    errorMessage="Invalid subscription price."
                                    error={errors.subcriptionPrice && true}
                                />
                            </div>
                        )}
                    </div>

                    <div className="w-6/12 flex items-center space-x-3 justify-end border-t py-6">
                        <Button
                            variant="primary"
                            className="bg-indigo-600 w-16 hover:bg-indigo-300"
                            type="submit"
                            disabled={loading}
                        >
                            Save
                        </Button>
                        <Button
                            variant="secondary"
                            className="w-16"
                            type="button"
                            disabled={loading}
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
