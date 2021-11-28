import React, { Dispatch, SetStateAction } from "react";
import { Button, GoogleMap, Select, TextArea, TextField } from "@element";
import useAddSpace, { useBasicSpace } from "@hooks/useAddSpace";
import { Controller } from "react-hook-form";
import { useEffect } from "react";
import axios from "axios";
import { normalizeZipCodeInput } from "src/utils/normalizeZipCode";

import useTranslation from "next-translate/useTranslation";

interface IBasicSpace {
    activeStep: number;
    setActiveStep: Dispatch<SetStateAction<number>>;
    steps: any[];
    setSpaceId: (id: any) => void;
    initialValue?: any;
    spaceLoading?: boolean;
}

const Basic = ({
    activeStep,
    setActiveStep,
    steps,
    setSpaceId,
    initialValue,
    spaceLoading,
}: IBasicSpace) => {
    const { spaceTypes } = useAddSpace();
    const {
        prefectures,
        loading,
        zipCode,
        setZipCode,
        cache,
        setCache,
        freeCoords,
        setFreeCoords,
        register,
        control,
        errors,
        watch,
        setValue,
        onSubmit,
    } = useBasicSpace(handleNext, initialValue);

    const hasNext: boolean = activeStep < steps.length - 1 && true;

    const { t } = useTranslation("adminhost");

    function handleNext(id): void {
        if (hasNext) setActiveStep(activeStep + 1);
        setSpaceId(id);
    }

    useEffect(() => {
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
        <>
            <div className="px-4 py-2 border-b border-gray-200 sm:px-6 sm:py-5 bg-gray-50">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    スペース
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    この情報は公開されますので、有効な情報を入力してください。
                </p>
            </div>
            {spaceLoading ? (
                <div className="flex items-center justify-center h-content">
                    <div className="w-24 h-24 border-t-2 border-b-2 border-green-500 rounded-full animate-spin" />
                </div>
            ) : (
                <form onSubmit={onSubmit}>
                    <div className="px-4 py-2 space-y-4 sm:px-6 sm:py-6">
                        <div className="">
                            <TextField
                                {...register("name", {
                                    required: true,
                                })}
                                label={t("space-name")}
                                error={errors.name && true}
                                errorMessage="Name is required"
                                autoFocus
                                disabled={loading}
                                singleRow
                            />
                        </div>
                        <div className="">
                            <TextArea
                                {...register("description", {
                                    required: true,
                                })}
                                label={t("space-description")}
                                error={errors.description && true}
                                errorMessage="Description is required"
                                disabled={loading}
                                rows={4}
                                singleRow
                            />
                        </div>
                        <div className="">
                            <TextField
                                {...register("maximumCapacity", {
                                    required: true,
                                    setValueAs: (val) => parseInt(val),
                                })}
                                label={t("max-capacity")}
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
                                label={t("space-number-of-seats")}
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
                                label={t("space-size")}
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
                                        label={t("space-types")}
                                        options={
                                            spaceTypes?.availableSpaceTypes ||
                                            []
                                        }
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

                        <div className="items-center flex-none sm:space-x-4 sm:flex">
                            <div className="w-60" />
                            <Controller
                                name="needApproval"
                                control={control}
                                render={({ field }: any) => (
                                    <div>
                                        {console.log(field)}
                                        <input
                                            {...field}
                                            checked={field.value}
                                            id="needApproval"
                                            aria-describedby="needApproval-description"
                                            type="checkbox"
                                            className="w-4 h-4 border-gray-300 rounded cursor-pointer text-primary focus:ring-primary"
                                        />
                                        <label
                                            htmlFor="needApproval"
                                            className="ml-3 text-sm font-medium text-gray-600 align-baseline cursor-pointer"
                                        >
                                            enable need host approval
                                        </label>
                                    </div>
                                )}
                            />
                        </div>

                        <div className="">
                            <TextField
                                {...register("zipCode", {
                                    required: true,
                                })}
                                label={t("address-postal-code")}
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
                                defaultValue={
                                    initialValue?.address?.Prefecture?.id
                                }
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label={t("address-prefecture")}
                                        options={
                                            prefectures?.availablePrefectures ||
                                            []
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
                                defaultValue={initialValue?.address?.city}
                                label={t("address-city")}
                                error={errors.city && true}
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
                                defaultValue={
                                    initialValue?.address?.addressLine1
                                }
                                label={t("address-line-1")}
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
                                defaultValue={
                                    initialValue?.address?.addressLine2
                                }
                                label={t("address-line-2")}
                                error={errors.zipCode && true}
                                errorMessage="Address Line 2 is required"
                                disabled={loading}
                                singleRow
                            />
                        </div>
                    </div>
                    <div className="items-center flex-none px-4 py-5 sm:space-x-4 sm:flex sm:px-6">
                        <label
                            htmlFor="Map"
                            className={"block text-sm font-medium text-gray-700 sm:text-right w-60"}
                        >
                            Map
                        </label>
                        <div className="w-full overflow-hidden rounded-md h-80 sm:w-96 sm:h-96">
                            <GoogleMap
                                setFreeCoords={setFreeCoords}
                                mark={freeCoords}
                                zoom={15}
                            />
                        </div>
                    </div>
                    <div className="px-4 py-5 sm:space-x-4 sm:flex sm:px-6">
                        <label
                            htmlFor="Map"
                            className={"block text-sm font-medium text-gray-700 sm:text-right w-60"}
                        >
                            Current Coordinates
                        </label>
                        <div className="w-full overflow-hidden rounded-md sm:w-96">
                            <p>Latitude: {freeCoords?.lat}</p>
                            <p>Longitude: {freeCoords?.lng}</p>
                        </div>
                    </div>
                    {initialValue ? (
                        <div className="flex justify-end px-4 py-5 bg-gray-50 sm:px-6">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-auto px-8"
                                loading={loading}
                            >
                                {t("save")}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex justify-between px-4 py-5 bg-gray-50 sm:px-6">
                            <Button className="w-auto px-8" disabled={true}>
                                {t("previous-page")}
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-auto px-8"
                                loading={loading}
                            >
                                {t("next-page")}
                            </Button>
                        </div>
                    )}
                </form>
            )}
        </>
    );
};

export default Basic;
