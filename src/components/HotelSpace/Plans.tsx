import React from "react";
import {
    FileUpload,
    TextArea,
    TextField,
    TimePickerField,
    Select,
    HotelNearestStation,
    Button,
    SwitchField,
    DatePickerField,
    RadioField,
} from "@element";
import useTranslation from "next-translate/useTranslation";

import { useForm, Controller } from "react-hook-form";

const format = "HH:mm a";

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
    { value: "perRoom", label: "Per Room Basis" },
    { value: "perPerson", label: "Per Person Basis" },
];

const Plans = () => {
    const { t } = useTranslation("adminhost");
    const { handleSubmit, reset, watch, control, register } = useForm();
    return (
        <>
            <form>
                <div className="px-0 py-3 space-y-6 sm:py-6">
                    <div className="lg:w-6/12 md:w-3/4 sm:w-full">
                        <p className="text-sm leading-5 font-medium">
                            Plan Name
                        </p>
                        <TextField
                            label={""}
                            errorMessage="Name is required"
                            autoFocus
                            onChange={() => {}}
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
                            onChange={() => {}}
                        />
                    </div>
                    {/* <div className="max-w-sm">
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
                    </div> */}
                    <div className="lg:w-6/12 md:w-3/4 sm:w-full flex flex-col space-y-2">
                        <SwitchField
                            label={
                                <>
                                    <span className="text-sm leading-5 font-medium">
                                        Usage Period
                                    </span>
                                </>
                            }
                            onChange={() => {}}
                        />
                        <div className="flex space-x-2">
                            <DatePickerField
                                onChange={() => {}}
                                className="sm:space-x-0 flex items-center flex-row-reverse space-x-2 "
                                label="from"
                                labelClassName=" ml-2 font-medium "
                            />
                            <DatePickerField
                                onChange={() => {}}
                                className="sm:space-x-0 flex items-center flex-row-reverse space-x-2 "
                                label="to"
                                labelClassName=" ml-2 font-medium "
                            />
                        </div>
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
                            onChange={() => {}}
                        />
                        <div className="flex space-x-2">
                            <DatePickerField
                                onChange={() => {}}
                                className="sm:space-x-0 flex items-center flex-row-reverse space-x-2 "
                                label="from"
                                labelClassName=" ml-2 font-medium "
                            />
                            <DatePickerField
                                onChange={() => {}}
                                className="sm:space-x-0 flex items-center flex-row-reverse space-x-2 "
                                label="to"
                                labelClassName=" ml-2 font-medium "
                            />
                        </div>
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
                            onChange={() => {}}
                        />
                        <div className="flex space-x-2">
                            <div className="flex items-center  space-x-2 max-w-min">
                                <TextField
                                    className="flex items-center space-x-2 w-14"
                                    label=""
                                    onChange={() => {}}
                                />
                                <p className="text-sm leading-6 font-medium min-w-max">
                                    Days Before
                                </p>
                            </div>
                            <div className="flex items-center  space-x-2 max-w-min">
                                <TimePickerField
                                    className="w-16"
                                    label=""
                                    placeholder="11:00"
                                    format="HH:mm"
                                    onChange={() => {}}
                                    suffixIcon={""}
                                />
                                <p className="text-sm leading-6 font-medium min-w-max">
                                    Till time
                                </p>
                            </div>
                        </div>
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
                        <FileUpload
                            hideLabel
                            label="Photos"
                            onChange={(e) => console.log(e)}
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
                        <RadioField
                            label=""
                            onChange={() => {}}
                            options={PAYMENT_TYPES}
                        />
                    </div>
                    <div className="lg:w-6/12 md:w-3/4 sm:w-full flex flex-col space-y-2">
                        <div className="pb-2">
                            <h3 className="font-medium text-lg text-gray-900">
                                Stock
                            </h3>
                        </div>
                        <TextField
                            label=""
                            onChange={() => {}}
                            className="w-20"
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
                    <div className="lg:w-6/12 md:w-3/4 sm:w-full flex flex-col space-y-2">
                        <div className="pb-2">
                            <h3 className="font-medium text-lg text-gray-900">
                                Price Setting
                            </h3>
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
