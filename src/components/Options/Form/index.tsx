import React, { useCallback, useEffect, useState, useRef } from "react";
import {
    FileUpload,
    TextArea,
    TextField,
    TimePickerField,
    Select,
    Button,
    SwitchField,
    DatePickerField,
    FormConfirmModal,
} from "@element";

import { Controller, FieldArrayWithId } from "react-hook-form";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import moment from "moment";
import { useQuery } from "@apollo/client";
import { DAY_OF_WEEK, PAYMENT_TYPES } from "@config";
import { LoadingSpinner } from "../../LoadingSpinner";
import { useToast } from "@hooks/useToasts";
import { useRouter } from "next/router";
import { useOptions } from "@hooks/options";
import { queries as OptionQueries } from "src/apollo/queries/options";

const timeFormat = "HH:mm a";
const dateFormat = "YYYY-MM-DD";

const PAYMENT_TERMS = [
    { label: "Per Person", value: "PER_PERSON" },
    { label: "Per Room", value: "PER_ROOM" },
    { label: "Per User", value: "PER_USER" },
    { label: "Per Flat", value: "PER_FLAT" },
];

type TOptionFormProps = {
    optionId?: string;
};

const AddOptionsForm = (props: TOptionFormProps) => {
    const { optionId } = props;
    const { addAlert } = useToast();
    const confirmModal = useRef(null);

    const {
        data: initialValue,
        loading: fetchingInitialData,
        refetch,
    } = useQuery(OptionQueries.OPTION_BY_ID, {
        skip: !optionId,
        variables: {
            id: optionId,
        },
    });

    const router = useRouter();
    const onCreateSuccess = useCallback((data) => {
        setTimeout(() => router.back(), 1500);
    }, []);

    const onCreateError = useCallback((data) => {
        addAlert({ type: "error", message: "Could not created new option." });
    }, []);

    const {
        loading,
        register,
        unregister,
        control,
        errors,
        dirtyFields,
        watch,
        setValue,
        handleSubmit,
        getValues,
        watchShowUsage,
        watchShowReservation,
        watchShowCutOff,
        watchAdditionalPrice,
        onSubmit,
        onAddOptionsPhotos,
        onRemoveOptionPhotos,
        onRemove,
    } = useOptions({
        onCreateSuccess,
        onCreateError,
        initialValue: initialValue?.optionById,
    });

    const handleUpload = useCallback(
        async (photo) => {
            onAddOptionsPhotos(photo)
                .then((data) => {
                    setTimeout(() => {
                        addAlert({
                            type: "success",
                            message: "Added photos successfully",
                        });
                        refetch();
                    }, 5000);
                })
                .catch((err) => {
                    addAlert({
                        type: "error",
                        message: "Could not add photos ",
                    });
                    refetch();
                });
        },
        [onAddOptionsPhotos, refetch]
    );

    const handleRemove = useCallback(() => {
        confirmModal?.current?.open();
    }, [confirmModal]);

    const onConfirmRemove = useCallback(() => {
        confirmModal?.current?.close();
        return onRemove();
    }, [confirmModal]);

    if (fetchingInitialData) {
        return <LoadingSpinner loadingText="Loading option detail" />;
    }
    return (
        <>
            <FormConfirmModal ref={confirmModal} onConfirm={onConfirmRemove}>
                <span>Are you sure you want to remove this option ?</span>
            </FormConfirmModal>

            <form className="px-2" onSubmit={onSubmit}>
                <div className="px-0 py-3 space-y-6 sm:py-6">
                    <div className="w-full md:w-8/12 lg:w-6/12">
                        <p className="text-sm leading-5 font-medium">
                            Options Name
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

                    <div className="w-full md:w-8/12 lg:w-6/12">
                        <p className="text-sm leading-5 font-medium">
                            Description
                        </p>
                        <TextArea
                            disabled={loading}
                            label={""}
                            errorMessage="Description is required"
                            {...register("description", {
                                required: false,
                            })}
                            error={errors.description && true}
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
                                            min: 1,
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
                            rules={{
                                required:
                                    !initialValue?.optionById?.photos?.length,
                            }}
                            control={control}
                            name="photos"
                            render={({ field: { onChange } }) => (
                                <FileUpload
                                    disabled={loading}
                                    key="option_form_photo_upload"
                                    id="option_form_photo_upload"
                                    hideLabel
                                    className="w-full"
                                    label=""
                                    error={errors.photos && true}
                                    defaultPhotos={
                                        initialValue?.optionById?.photos
                                    }
                                    errorMessage="Photos are required"
                                    onChange={(e) => onChange(e)}
                                    onRemove={onRemoveOptionPhotos}
                                    onUpload={handleUpload}
                                />
                            )}
                        />
                    </div>

                    <div className="lg:w-6/12 md:w-3/4 sm:w-full flex flex-col space-y-2">
                        <SwitchField
                            label={
                                <>
                                    <span className="text-sm leading-5 font-medium">
                                        Additional Price
                                    </span>
                                </>
                            }
                            defaultValue={getValues("additionalPriceAllowed")}
                            onChange={(val) =>
                                setValue("additionalPriceAllowed", val)
                            }
                        />
                        {watchAdditionalPrice && (
                            <div className="flex flex-col w-full space-y-2 items-start">
                                <div className="w-full md:w-6/12 lg:w-4/12">
                                    <Controller
                                        rules={{
                                            required: watchAdditionalPrice,
                                        }}
                                        control={control}
                                        name="paymentTerm"
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                label=""
                                                options={PAYMENT_TERMS}
                                                error={
                                                    errors.paymentTerm && true
                                                }
                                                onChange={(val) =>
                                                    field.onChange(val)
                                                }
                                                errorMessage="Payment terms is required"
                                                labelKey="label"
                                                valueKey="value"
                                                disabled={loading}
                                            />
                                        )}
                                    />
                                </div>

                                <div className="w-full md:w-6/12 lg:w-4/12">
                                    <TextField
                                        disabled={loading}
                                        label=""
                                        {...register("additionalPrice", {
                                            required: watchAdditionalPrice,
                                            min: {
                                                value: 0,
                                                message:
                                                    "Value should not be less than 0",
                                            },
                                            valueAsNumber: true,
                                        })}
                                        type="number"
                                        error={errors.additionalPrice && true}
                                    />
                                </div>
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

                        {initialValue && (
                            <Button
                                variant="primary"
                                className="bg-red-600 w-16 hover:bg-red-300"
                                type="button"
                                disabled={loading}
                                onClick={handleRemove}
                            >
                                Delete
                            </Button>
                        )}
                        <Button
                            variant="secondary"
                            className="w-16"
                            type="button"
                            disabled={loading}
                            // onClick={toggleForm}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AddOptionsForm;
