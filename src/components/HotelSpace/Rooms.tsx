import React from "react";
import {
    FileUpload,
    TextArea,
    TextField,
    TimePickerField,
    Select,
    HotelNearestStation,
    Button,
    RadioField,
} from "@element";
import useTranslation from "next-translate/useTranslation";

import { useForm, Controller } from "react-hook-form";

const BASIC_PIRCING = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Rooms = () => {
    const { t } = useTranslation("adminhost");
    const { handleSubmit, reset, watch, control, register } = useForm();

    return (
        <form>
            <div className="px-0 py-3 space-y-6 sm:py-6">
                <div className="lg:w-6/12 md:w-3/4 sm:w-full">
                    <TextField
                        label={t("name")}
                        errorMessage="Name is required"
                        autoFocus
                        onChange={() => {}}
                    />
                </div>
                <div className="lg:w-6/12 md:w-3/4 sm:w-full">
                    <TextArea
                        label={"Description"}
                        errorMessage="Description is required"
                        autoFocus
                        rows={3}
                        onChange={() => {}}
                    />
                </div>
                <div className="max-w-screen-sm">
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
                        label="Photos"
                        onChange={(e) => console.log(e)}
                    />
                </div>
                <div className="max-w-screen-sm">
                    <div className="pb-2">
                        <p className="text-lg font-medium leading-6">
                            Payment Terms
                        </p>
                    </div>
                    <RadioField
                        label=""
                        onChange={(e) => console.log(e)}
                        options={[
                            { value: "perRoom", label: "Per Room Basis" },
                            { value: "perPerson", label: "Per Person Basis" },
                        ]}
                    />
                </div>
                <div className="w-6/12">
                    <div className="pb-2">
                        <p className="text-lg font-medium leading-6">
                            Maximum Capacity
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <div className=" lg:w-6/12">
                            <Controller
                                name={`Adult`}
                                control={control}
                                rules={{ required: true }}
                                // defaultValue={
                                //     initialValue?.address?.Prefecture?.id
                                // }
                                render={({ field }) => (
                                    <div>
                                        <p className="text-sm leading-5 font-medium text-gray-700">
                                            Adult
                                        </p>
                                        <Select
                                            {...field}
                                            label={""}
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
                                    </div>
                                )}
                            />
                        </div>

                        <div className="lg:w-6/12">
                            <Controller
                                name={`Child`}
                                control={control}
                                rules={{ required: true }}
                                // defaultValue={
                                //     initialValue?.address?.Prefecture?.id
                                // }
                                render={({ field }) => (
                                    <div>
                                        <p className="text-sm leading-5 font-medium text-gray-700">
                                            Child
                                        </p>
                                        <Select
                                            {...field}
                                            label={""}
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
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className=" w-1/12">
                    <div className="pb-2">
                        <p className="text-lg font-medium leading-6">Stock</p>
                    </div>
                    <TextField
                        label=""
                        onChange={(e) => console.log(e)}
                        type="number"
                    />
                </div>
                <div className="sm:w-6/12">
                    <div className="flex justify-between items-center pb-4">
                        <p className="text-lg font-medium leading-6">
                            Basic Pricing Setting
                        </p>
                        <Button
                            type="button"
                            className="w-36 bg-indigo-100 text-indigo-700 text-sm leading-5 font-medium"
                        >
                            Pricing Overrides
                        </Button>
                    </div>
                    <div className="grid grid-cols-7">
                        {BASIC_PIRCING.map((pricing, index) => (
                            <div
                                className="flex flex-col border text-center first:rounded-l-md last:rounded-r-md px-2 py-2"
                                key={index}
                            >
                                <p className=" text-xl">{pricing}</p>
                                <Controller
                                    name={`Adult`}
                                    control={control}
                                    rules={{ required: true }}
                                    // defaultValue={
                                    //     initialValue?.address?.Prefecture?.id
                                    // }
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            label={""}
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
                        ))}
                    </div>

                    <div className="flex justify-end space-x-3 border-t mt-4 pt-5">
                        <Button
                            type="button"
                            variant="primary"
                            className="bg-indigo-600 font-medium text-sm w-16 hover:bg-indigo-400"
                        >
                            Save
                        </Button>
                        <Button
                            type="button"
                            variant="white"
                            className="font-medium border-l text-sm w-16"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Rooms;
