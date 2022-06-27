import React from "react";
import {
    FileUpload,
    TextArea,
    TextField,
    TimePickerField,
    Select,
} from "@element";
import useTranslation from "next-translate/useTranslation";

import { useForm, Controller } from "react-hook-form";

const format = "HH:mm a";

const General = () => {
    const { t } = useTranslation("adminhost");
    const { handleSubmit, reset, watch, control, register } = useForm();
    return (
        <>
            <form>
                <div className="px-0 py-3 space-y-4 sm:py-6">
                    <div className="max-w-screen-sm">
                        <TextField
                            label={t("name")}
                            errorMessage="Name is required"
                            autoFocus
                            onChange={() => {}}
                        />
                    </div>
                    <div className="max-w-screen-sm">
                        <TextArea
                            label="Description"
                            errorMessage="Description is required"
                            autoFocus
                            rows={3}
                            onChange={() => {}}
                        />
                    </div>
                    <div className="max-w-sm">
                        <TimePickerField
                            label="Check in time"
                            onChange={(e) => console.log(e)}
                            format={format}
                            use12Hours={true}
                        />
                    </div>
                    <div className="max-w-sm">
                        <TimePickerField
                            label="Check out time"
                            onChange={(e) => console.log(e)}
                            format={format}
                            use12Hours={true}
                        />
                    </div>

                    <div className="max-w-screen-sm">
                        <div className="pb-2">
                            <h3 className="font-bold text-xl">Photos</h3>
                            <p>
                                この情報は情報は一般に公開されますので、必ず有効な情報を追加してください。
                            </p>
                        </div>
                        <FileUpload
                            hideLabel
                            label="Photos"
                            onChange={(e) => console.log(e)}
                        />
                    </div>

                    <div className="pb-2">
                        <h3 className="font-bold text-xl">Address</h3>
                    </div>
                    <div className="lg:w-32 md:w-52 sm:max-w-sm">
                        <TextField
                            {...register("zipCode", {
                                required: true,
                            })}
                            placeholder="〒"
                            label={t("address-postal-code")}
                            errorMessage="Zip Code is required"
                        />
                    </div>
                    <div className="max-w-sm">
                        <Controller
                            name={`prefecture`}
                            control={control}
                            rules={{ required: true }}
                            // defaultValue={
                            //     initialValue?.address?.Prefecture?.id
                            // }
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label={t("address-prefecture")}
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
                    <div className="max-w-sm">
                        <TextField
                            {...register("city", {
                                required: true,
                            })}
                            // defaultValue={initialValue?.address?.city}
                            label={t("address-city")}
                            // error={errors.city && true}
                            errorMessage="City is required"
                            // disabled={loading}
                        />
                    </div>
                    <div className="max-w-sm">
                        <TextField
                            {...register("addressLine1", {
                                required: true,
                            })}
                            // defaultValue={
                            //     initialValue?.address?.addressLine1
                            // }
                            label={t("address-line-1")}
                            // error={errors.zipCode && true}
                            errorMessage="Address Line 1 is required"
                            // disabled={loading}
                        />
                    </div>
                    <div className="max-w-sm">
                        <TextField
                            {...register("addressLine2", {
                                required: true,
                            })}
                            // defaultValue={
                            //     initialValue?.address?.addressLine2
                            // }
                            label={t("address-line-2")}
                            // error={errors.zipCode && true}
                            errorMessage="Address Line 2 is required"
                            // disabled={loading}
                        />
                    </div>

                    <div className="pb-2">
                        <h3 className="font-bold text-xl">最寄り駅</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            施設様のご利用しやすい最寄り駅をお選びください
                            <br />
                            ※複数お選びいただけます。
                        </p>
                    </div>
                </div>
            </form>
        </>
    );
};

export default General;
