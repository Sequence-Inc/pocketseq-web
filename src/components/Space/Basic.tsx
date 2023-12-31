import React, { Dispatch, SetStateAction, useState } from "react";
import {
    Button,
    GoogleMap,
    Select,
    SwitchField,
    TextArea,
    TextField,
} from "@element";
import { default as ReactSelect } from "react-select";
import useAddSpace, { useBasicSpace } from "@hooks/useAddSpace";
import { Controller } from "react-hook-form";
import { useEffect } from "react";
import axios from "axios";
import { normalizeZipCodeInput } from "src/utils/normalizeZipCode";

import useTranslation from "next-translate/useTranslation";
import {
    BusinessDaysManager,
    PricingPlanManager,
    BusinessHourManager,
    StockManager,
} from "@page/host/my-space/edit/[id]/days-of-week";
import { LoadingSpinner } from "../LoadingSpinner";
import { useRouter } from "next/router";

interface IBasicSpace {
    activeStep: number;
    setActiveStep: Dispatch<SetStateAction<number>>;
    steps: any[];
    setSpaceId: (id: any) => void;
    selectedSpaceId?: any;
    spaceLoading?: boolean;
}

const Basic = ({
    activeStep,
    setActiveStep,
    steps,
    setSpaceId,
    selectedSpaceId,
    spaceLoading,
}: IBasicSpace) => {
    const [change, setChange] = useState<boolean>(false);
    const { spaceTypes } = useAddSpace();
    const hasNext: boolean = activeStep < steps.length - 1 && true;

    const router = useRouter();
    const redirectToOptions = () => router.push("/host/options");

    const handleNext = (id): void => {
        setSpaceId(id);
        if (hasNext) setActiveStep(activeStep + 1);
    };

    const {
        prefectures,
        loading,
        zipCode,
        setZipCode,
        cache,
        setCache,
        freeCoords,
        register,
        unregister,
        control,
        errors,
        watch,
        setValue,
        onSubmit,
        getValues,
        includedOptions,
        additionalOptions,
        handleIncludedOptionFieldChange,
        handleAdditionalOptionFieldChange,
        cancelPolicies,
        initialValue,
        spaceDetailLoading,
        watchSubscriptionPrice,
    } = useBasicSpace(handleNext, selectedSpaceId);

    const { t } = useTranslation("adminhost");

    useEffect(() => {
        const api = async () => {
            const newZipCode = normalizeZipCodeInput(watch().zipCode, zipCode);
            setZipCode(newZipCode);
            if (newZipCode?.length === 3) {
                const prefix = newZipCode;
                // check if prefix already has the data
                if (!cache[prefix]) {
                    // fetch data
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
    console.log("Rendered");
    return (
        <>
            <div className="px-4 py-2 border-b border-gray-200 sm:px-6 sm:py-5 bg-gray-50">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    スペース
                </h3>
                <div className="mt-1 text-sm text-gray-500">
                    この情報は公開されますので、有効な情報を入力してください。
                </div>
            </div>
            {spaceDetailLoading ? (
                <div className="my-20">
                    <LoadingSpinner />
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
                                    min: 1,
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
                                    min: 1,
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
                                    min: 0,
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

                        {/* <div className="">
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
                        </div> */}
                        <div className="sm:space-x-4 flex-none sm:flex items-center">
                            <label
                                htmlFor=""
                                className="block text-sm font-bold text-gray-700 sm:text-right w-60"
                            >
                                スペースタイプ
                            </label>
                            <div className="relative rounded-md sm:w-96">
                                <Controller
                                    name="spaceTypes"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({
                                        field: {
                                            ref,
                                            name,
                                            value,
                                            onChange,
                                            onBlur,
                                        },
                                    }) => {
                                        // const selectedSpaceTypes =
                                        //     spaceTypes?.availableSpaceTypes?.filter(
                                        //         (type) => value.includes(type.id)
                                        //     );
                                        // console.log(selectedSpaceTypes);
                                        return (
                                            <ReactSelect
                                                options={
                                                    spaceTypes?.availableSpaceTypes?.map(
                                                        (items) => ({
                                                            value: items.id,
                                                            label: items.title,
                                                        })
                                                    ) || []
                                                }
                                                value={
                                                    value?.map((item) => ({
                                                        value: item.id,
                                                        label: item.title,
                                                    })) || []
                                                }
                                                isMulti={true}
                                                isLoading={loading}
                                                onChange={(event) => {
                                                    console.log(event);
                                                    const newValue = event.map(
                                                        (item) => {
                                                            return spaceTypes?.availableSpaceTypes?.filter(
                                                                (spaceType) =>
                                                                    item.value ===
                                                                    spaceType.id
                                                            )[0];
                                                        }
                                                    );
                                                    console.log(newValue);
                                                    setValue(
                                                        "spaceTypes",
                                                        newValue
                                                    );
                                                }}
                                                onBlur={onBlur}
                                                ref={ref}
                                                name={name}
                                            />
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        <div className="">
                            <Controller
                                name="cancelPolicyId"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label={"キャンセルポリシー"}
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

                        <div className="items-center flex-none sm:space-x-4 sm:flex">
                            <div className="w-60" />
                            <Controller
                                name="needApproval"
                                control={control}
                                render={({ field }: any) => (
                                    <div>
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
                                            リクエスト予約
                                            <br />
                                            ※施設側の確認が必要な場合
                                        </label>
                                    </div>
                                )}
                            />
                        </div>

                        <div className="pb-1">
                            <div className="border-t border-gray-200 my-8"></div>
                            <div className="md:ml-60 md:pl-4  flex items-center space-x-4">
                                <h3 className="font-bold text-primary text-xl">
                                    オプション
                                </h3>

                                <Button
                                    type="button"
                                    onClick={redirectToOptions}
                                    className="w-36 bg-indigo-100 text-indigo-700 text-sm leading-5 font-medium"
                                >
                                    オプションの管理
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col items-start justify-evenly  mx-auto w-9/12  ">
                            <div className="flex justify-between items-center pb-4 space-x-4">
                                <div className="font-bold text-base">
                                    含まれるオプション
                                </div>
                            </div>
                            <div className="flex flex-wrap">
                                {includedOptions?.map((option: any, index) => (
                                    <div
                                        className="flex items-center space-x-4 py-2 ml-3 "
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

                                        <div className="text-sm leading-4 font-medium">
                                            {option?.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col items-start justify-evenly  mx-auto w-9/12  ">
                            <div className="font-bold text-base">
                                追加のオプション
                            </div>
                            <div className="flex flex-wrap">
                                {additionalOptions?.map(
                                    (option: any, index) => (
                                        <div
                                            className="flex items-center space-x-4 py-2 ml-3 "
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

                                            <div className="text-sm leading-4 font-medium">
                                                {option?.name}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="pb-1">
                            <div className="border-t border-gray-200 my-8"></div>
                            <h3 className="md:ml-60 md:pl-4 font-bold text-primary text-xl">
                                住所
                            </h3>
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
                                    required: false,
                                })}
                                defaultValue={
                                    initialValue?.address?.addressLine2
                                }
                                label={t("address-line-2")}
                                error={errors.addressLine2 && true}
                                errorMessage="Invalid address Line 2 "
                                disabled={loading}
                                singleRow
                            />
                        </div>
                    </div>
                    {initialValue && (
                        <div className="items-center flex-none px-4 py-5 sm:space-x-4 sm:flex sm:px-6">
                            <label
                                htmlFor="Map"
                                className={
                                    "block text-sm font-bold text-gray-700 sm:text-right w-60"
                                }
                            >
                                Map
                            </label>
                            <div className="w-full overflow-hidden rounded-md h-80 sm:w-96 sm:h-96">
                                <GoogleMap mark={freeCoords} zoom={16} />
                            </div>
                        </div>
                    )}

                    <div className="pb-1">
                        <div className="border-t border-gray-200 my-8"></div>
                        <h3 className="md:ml-60 md:pl-4 font-bold text-primary text-xl">
                            基本設定
                        </h3>
                    </div>
                    <div className="items-center flex-none px-4 py-5 sm:space-x-4 sm:flex sm:px-6">
                        <div className="w-full rounded-md">
                            <BusinessDaysManager
                                defaultValue={getValues("businessDays")}
                                onSave={(value) => {
                                    setValue("businessDays", value);
                                }}
                            />

                            {/* <HolidayManager
                                defaultValue={false}
                                onSave={(value) => console.log(value)}
                            /> */}
                            <BusinessHourManager
                                defaultValue={{
                                    openingHr: getValues("openingHr"),
                                    closingHr: getValues("closingHr"),
                                    breakFromHr: getValues("breakFromHr"),
                                    breakToHr: getValues("breakToHr"),
                                }}
                                onSave={(value) => {
                                    const {
                                        openingHr,
                                        closingHr,
                                        breakFromHr,
                                        breakToHr,
                                    } = value;
                                    setValue("openingHr", openingHr);
                                    setValue("closingHr", closingHr);

                                    setValue("breakFromHr", breakFromHr);
                                    setValue("breakToHr", breakToHr);
                                }}
                            />
                            <StockManager
                                defaultValue={getValues("totalStock")}
                                onSave={(value) => {
                                    setValue("totalStock", value);
                                }}
                            />
                            <PricingPlanManager
                                defaultValue={getValues("pricePlan")}
                                onSave={(value) => setValue("pricePlan", value)}
                            />
                        </div>
                    </div>

                    <div className="pb-1  ">
                        <div className="border-t border-gray-200 my-8"></div>

                        <h3 className="font-bold md:ml-60 md:pl-4  text-primary text-xl">
                            サブスクリプション
                        </h3>
                        <div className="md:ml-60 md:pl-4 mt-4 ">
                            <SwitchField
                                label={
                                    <>
                                        <span className="text-sm leading-5 font-medium">
                                            サブスクリプション用の料金
                                        </span>
                                    </>
                                }
                                defaultValue={getValues(
                                    "subscriptionPriceEnabled"
                                )}
                                onChange={(val) =>
                                    setValue("subscriptionPriceEnabled", val)
                                }
                            />

                            <div className="lg:w-6/12 md:w-3/4 sm:w-full flex flex-col space-y-2 ">
                                {watchSubscriptionPrice && (
                                    <div className="flex items-center space-x-2  mt-4 ">
                                        <TextField
                                            disabled={loading}
                                            label=""
                                            {...register("subcriptionPrice", {
                                                required:
                                                    watchSubscriptionPrice,
                                                min: 0,
                                                valueAsNumber: true,
                                            })}
                                            type="number"
                                            placeholder="Subscription Price"
                                            errorMessage="Invalid subscription price."
                                            error={
                                                errors.subcriptionPrice && true
                                            }
                                        />
                                        <span className="inline-block ml-2">
                                            円
                                        </span>
                                    </div>
                                )}
                            </div>
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
                            {/* <Button className="w-auto px-8" disabled={true}>
                                {t("previous-page")}
                            </Button> */}
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
