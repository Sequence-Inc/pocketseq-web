import React, { useEffect } from "react";
import {
    FileUpload,
    TextArea,
    TextField,
    TimePickerField,
    Select,
    HotelNearestStation,
    Button,
} from "@element";
import useTranslation from "next-translate/useTranslation";
import axios from "axios";
import { Controller } from "react-hook-form";
import { normalizeZipCodeInput } from "src/utils/normalizeZipCode";
import { useAddGeneral } from "@hooks/useAddHotelSpace";
import { useRouter } from "next/router";

import { TAddHotelProps } from "@appTypes/timebookTypes";
import { getVariableValues } from "graphql/execution/values";

const format = "HH:mm a";

interface IGeneralFormProps extends TAddHotelProps {
    setHotelId: any;
    initialValue?: any;
    hotelLoading?: boolean;
}

const General = ({
    setActiveTab,
    activeTab,
    setHotelId,
    initialValue,
    hotelLoading,
}: IGeneralFormProps) => {
    const { t } = useTranslation("adminhost");
    const router = useRouter();
    const {
        onSubmit,
        errors,
        loading,
        setValue,
        watch,
        control,
        register,
        zipCode,
        setZipCode,
        cache,
        setCache,
        prefectures,
        getValues,
    } = useAddGeneral(handleNext, initialValue);

    function handleNext(id): void {
        setHotelId(id);
        setActiveTab(activeTab + 1);
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

    console.log({ initialValue });
    return (
        <>
            <form onSubmit={onSubmit} id="add-hotel-space">
                <div className="px-2 py-3 space-y-6 sm:py-6">
                    <div className="w-full md:w-8/12 lg:w-6/12">
                        <p className="text-sm leading-5 font-medium">
                            {t("name")}
                        </p>
                        <TextField
                            label={""}
                            {...register("name", {
                                required: true,
                            })}
                            defaultValue={initialValue?.name}
                            error={errors.name && true}
                            errorMessage="Name is required"
                            autoFocus
                            disabled={loading}
                        />
                    </div>
                    <div className="w-full md:w-8/12 lg:w-6/12">
                        <p className="text-sm leading-5 font-medium">
                            Description
                        </p>
                        <TextArea
                            label=""
                            {...register("description", {
                                required: true,
                            })}
                            errorMessage="Description is required"
                            autoFocus
                            error={errors.description && true}
                            rows={3}
                            defaultValue={initialValue?.description}
                            disabled={loading}
                        />
                    </div>
                    <div className="w-full sm:w-80">
                        <p className="text-sm leading-5 font-medium">
                            Check in time
                        </p>
                        <Controller
                            rules={{ required: true }}
                            control={control}
                            name="checkInTime"
                            render={({ field: { onChange } }) => (
                                <TimePickerField
                                    label=""
                                    onChange={(e) => {
                                        onChange(e?.format("HH:mm:ss"));
                                    }}
                                    id="checkInTime"
                                    error={errors.checkInTime && true}
                                    errorMessage="Check In time is required"
                                    format={format}
                                    use12Hours={true}
                                    disabled={loading}
                                    value={getValues("checkInTime")}
                                />
                            )}
                        />
                    </div>
                    <div className="w-full sm:w-80">
                        <p className="text-sm leading-5 font-medium">
                            Check out time
                        </p>
                        <Controller
                            rules={{ required: true }}
                            control={control}
                            name="checkOutTime"
                            render={({ field: { onChange } }) => (
                                <TimePickerField
                                    label=""
                                    onChange={(e) => {
                                        onChange(e?.format("HH:mm:ss"));
                                    }}
                                    id="checkOutTime"
                                    error={errors.checkOutTime && true}
                                    errorMessage="Check Out time is required"
                                    format={format}
                                    use12Hours={true}
                                    disabled={loading}
                                    value={getValues("checkOutTime")}
                                />
                            )}
                        />
                    </div>

                    <div className="w-full md:w-8/12 lg:w-6/12">
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
                                    key="room_form"
                                    id="general_form"
                                    hideLabel
                                    className="w-full"
                                    label=""
                                    error={errors.photos && true}
                                    errorMessage="Photos are required"
                                    onChange={(e) => {
                                        onChange(e);
                                    }}
                                    defaultPhotos={initialValue?.photos}
                                />
                            )}
                        />
                    </div>

                    <div className="pb-0">
                        <h3 className="font-medium text-lg leading-6">
                            Address
                        </h3>
                    </div>
                    <div className=" w-full sm:w-32 space-y-2">
                        <p className="text-sm leading-5 font-medium">
                            {t("address-postal-code")}
                        </p>
                        <TextField
                            {...register("zipCode", {
                                required: true,
                            })}
                            placeholder="〒"
                            label=""
                            errorMessage="Zip Code is required"
                            disabled={loading}
                        />
                    </div>
                    <div className="w-full md:w-8/12 lg:w-6/12 sm:w-full">
                        <Controller
                            name={`prefecture`}
                            control={control}
                            rules={{ required: true }}
                            defaultValue={initialValue?.address?.prefecture?.id}
                            render={({ field }) => (
                                <div className="space-y-2">
                                    <p>{t("address-prefecture")}</p>
                                    <Select
                                        {...field}
                                        label=""
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
                                    />
                                </div>
                            )}
                        />
                    </div>
                    <div className="w-full md:w-8/12 lg:w-6/12 space-y-2">
                        <p className="text-sm leading-5 font-medium">
                            {t("address-city")}
                        </p>

                        <TextField
                            {...register("city", {
                                required: true,
                            })}
                            // defaultValue={initialValue?.address?.city}
                            label=""
                            error={errors.city && true}
                            errorMessage="City is required"
                            disabled={loading}
                        />
                    </div>
                    <div className="w-full md:w-8/12 lg:w-6/12 space-y-2">
                        <p className="text-sm leading-5 font-medium">
                            {t("address-line-1")}
                        </p>
                        <TextField
                            {...register("addressLine1", {
                                required: true,
                            })}
                            // defaultValue={
                            //     initialValue?.address?.addressLine1
                            // }
                            label=""
                            error={errors.addressLine1 && true}
                            errorMessage="Address Line 1 is required"
                            disabled={loading}
                        />
                    </div>
                    <div className="w-full md:w-8/12 lg:w-6/12 space-y-2">
                        <p className="text-sm leading-5 font-medium">
                            {t("address-line-2")}
                        </p>
                        <TextField
                            {...register("addressLine2", {
                                required: true,
                            })}
                            // defaultValue={
                            //     initialValue?.address?.addressLine2
                            // }
                            label={""}
                            error={errors.addressLine2 && true}
                            errorMessage="Address Line 2 is required"
                            disabled={loading}
                        />
                    </div>

                    <div className="pb-2">
                        <h3 className="font-medium text-lg text-gray-900 leading-6">
                            最寄り駅
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            施設様のご利用しやすい最寄り駅をお選びください
                            <br />
                            ※複数お選びいただけます。
                        </p>
                    </div>
                    <div className="w-full md:w-8/12 lg:w-6/12">
                        <Controller
                            control={control}
                            name="nearestStations"
                            rules={{ required: true }}
                            render={({ field: { onChange } }) => (
                                <HotelNearestStation
                                    onChange={onChange}
                                    defaultValues={
                                        initialValue?.nearestStations || []
                                    }
                                />
                            )}
                        />
                    </div>

                    <div className="w-full md:w-8/12 lg:w-6/12 flex items-center space-x-3  justify-end border-t py-6">
                        <Button
                            variant="primary"
                            className="bg-indigo-600 w-16 hover:bg-indigo-400"
                            type="submit"
                            loading={loading}
                            loadingText={"Please wait"}
                        >
                            Save
                        </Button>
                        <Button
                            variant="secondary"
                            className="w-16"
                            type="button"
                            disabled={loading}
                            onClick={() => router.push("/host/hotel-space")}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default General;
