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

import { useForm, Controller } from "react-hook-form";
import { normalizeZipCodeInput } from "src/utils/normalizeZipCode";
import useAddGeneral from "@hooks/useAddHotelSpace";

const format = "HH:mm a";

const General = () => {
    const { t } = useTranslation("adminhost");

    const {
        handleSubmit,
        reset,
        setValue,
        watch,
        control,
        register,
        zipCode,
        setZipCode,
        cache,
        setCache,
        prefectures,
    } = useAddGeneral(handleNext);

    function handleNext(id): void {
        console.log({ id });
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
    return (
        <>
            <form>
                <div className="px-0 py-3 space-y-6 sm:py-6">
                    <div className="lg:w-6/12 md:w-6/12 sm:w-full">
                        <p className="text-sm leading-5 font-medium">
                            {t("name")}
                        </p>
                        <TextField
                            label={""}
                            {...register("name")}
                            errorMessage="Name is required"
                            autoFocus
                            onChange={() => {}}
                        />
                    </div>
                    <div className="lg:w-6/12 md:w-6/12 sm:w-full">
                        <p className="text-sm leading-5 font-medium">
                            Description
                        </p>
                        <TextArea
                            label=""
                            errorMessage="Description is required"
                            autoFocus
                            rows={3}
                            onChange={() => {}}
                        />
                    </div>
                    <div className="lg:w-80 md:w-80 sm:w-full">
                        <p className="text-sm leading-5 font-medium">
                            Check in time
                        </p>
                        <TimePickerField
                            label=""
                            onChange={(e) => console.log(e)}
                            format={format}
                            use12Hours={true}
                        />
                    </div>
                    <div className="lg:w-80 md:w-80 sm:w-full">
                        <p className="text-sm leading-5 font-medium">
                            Check out time
                        </p>
                        <TimePickerField
                            label=""
                            onChange={(e) => console.log(e)}
                            format={format}
                            use12Hours={true}
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
                        <FileUpload
                            hideLabel
                            className="w-full"
                            label="Photos"
                            onChange={(e) => console.log(e)}
                        />
                    </div>

                    <div className="pb-0">
                        <h3 className="font-medium text-lg leading-6">
                            Address
                        </h3>
                    </div>
                    <div className="lg:w-32 md:w-52 sm:max-w-sm space-y-2">
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
                        />
                    </div>
                    <div className="lg:w-80 md:w-9/12 sm:w-full">
                        <Controller
                            name={`prefecture`}
                            control={control}
                            rules={{ required: true }}
                            // defaultValue={
                            //     initialValue?.address?.Prefecture?.id
                            // }
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
                                        // error={errors?.prefecture && true}
                                        onChange={(event) => {
                                            field.onChange(event);
                                        }}
                                        errorMessage="Prefecture is required"
                                        labelKey="name"
                                        valueKey="id"
                                        // disabled={loading}
                                    />
                                </div>
                            )}
                        />
                    </div>
                    <div className="lg:w-80 md:w-9/12 sm:w-full space-y-2">
                        <p className="text-sm leading-5 font-medium">
                            {t("address-city")}
                        </p>

                        <TextField
                            {...register("city", {
                                required: true,
                            })}
                            // defaultValue={initialValue?.address?.city}
                            label=""
                            // error={errors.city && true}
                            errorMessage="City is required"
                            // disabled={loading}
                        />
                    </div>
                    <div className="lg:w-80 md:w-9/12 sm:w-full space-y-2">
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
                            // error={errors.zipCode && true}
                            errorMessage="Address Line 1 is required"
                            // disabled={loading}
                        />
                    </div>
                    <div className="lg:w-80 md:w-9/12 sm:w-full space-y-2">
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
                            // error={errors.zipCode && true}
                            errorMessage="Address Line 2 is required"
                            // disabled={loading}
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
                    <div>
                        <HotelNearestStation />
                    </div>

                    <div className="w-6/12 flex items-center space-x-3 justify-end border-t py-6">
                        <Button
                            variant="primary"
                            className="bg-indigo-600 w-16 hover:bg-indigo-400"
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

export default General;
