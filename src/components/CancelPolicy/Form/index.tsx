import { Select, TextField, Button } from "@element";
import { useCancelPolicy } from "@hooks/cancel-policy";
import { useRouter } from "next/router";
import React from "react";
import { Controller } from "react-hook-form";

const CancelPolicyForm = () => {
    const router = useRouter();
    const {
        register,
        unregister,
        control,
        errors,
        watch,
        setValue,

        onSubmit,
        getValues,
        policiesField,
        append,
        update,
        remove,
        spaces,
        spacesLoading,
        hotels,
        hotelsLoading,
        onAddPolciesField,
        onRemovePoliciesField,
    } = useCancelPolicy();

    return (
        <form onSubmit={onSubmit}>
            <div className="px-2 py-3 space-y-6 sm:py-6">
                <div className="w-full md:w-8/12 lg:w-6/12">
                    <p className="text-base leading-5 font-semibold">Space</p>

                    <Controller
                        rules={{
                            required: !getValues("hotelId"),
                        }}
                        name="spaceId"
                        control={control}
                        render={({ field }) => (
                            <div className="space-y-2">
                                <Select
                                    {...field}
                                    label={""}
                                    valueKey="id"
                                    labelKey="name"
                                    options={spaces?.mySpaces || []}
                                    onChange={(val) => field.onChange(val)}
                                    error={errors.spaceId && true}
                                    errorMessage="Space is required"
                                />
                            </div>
                        )}
                    />
                </div>

                <div className="w-full md:w-8/12 lg:w-6/12">
                    <p className="text-base leading-5 font-semibold">Hotel</p>

                    <Controller
                        rules={{
                            required: !getValues("spaceId"),
                        }}
                        name="hotelId"
                        control={control}
                        render={({ field }) => (
                            <div className="space-y-2">
                                <Select
                                    {...field}
                                    label={""}
                                    valueKey="id"
                                    labelKey="name"
                                    options={hotels?.myHotels || []}
                                    onChange={(val) => field.onChange(val)}
                                    error={errors.hotelId && true}
                                    errorMessage="Hotel is required"
                                />
                            </div>
                        )}
                    />
                </div>
                <div className="w-full md:w-8/12 lg:w-6/12">
                    <p className="text-base leading-5 font-semibold">
                        Policies
                    </p>
                    {policiesField?.map((field, index) => (
                        <div
                            className="w-full my-3 flex items-end justify-between space-x-2"
                            key={field.policyId}
                        >
                            <div className="flex flex-col flex-1 ">
                                <p>Before Hours</p>
                                <TextField
                                    label=""
                                    {...register(
                                        `policies.${index}.beforeHours`,
                                        {
                                            valueAsNumber: true,
                                        }
                                    )}
                                    type="number"
                                />
                            </div>
                            <div className="flex flex-col flex-1">
                                <p>Percentage</p>
                                <TextField
                                    label=""
                                    {...register(
                                        `policies.${index}.percentage`,
                                        {
                                            valueAsNumber: true,
                                        }
                                    )}
                                    type="number"
                                />
                            </div>
                            <Button
                                className=" max-w-min"
                                onClick={() => onRemovePoliciesField(index)}
                                type="button"
                            >
                                Remove
                            </Button>
                        </div>
                    ))}

                    <Button onClick={() => onAddPolciesField()} type="button">
                        Add
                    </Button>
                </div>

                <div className="w-full md:w-8/12 lg:w-6/12 flex items-center space-x-3  justify-end border-t py-6">
                    <Button
                        variant="primary"
                        className="bg-indigo-600 w-16 hover:bg-indigo-400"
                        type="submit"
                        loadingText={"Please wait"}
                    >
                        Save
                    </Button>
                    <Button
                        variant="secondary"
                        className="w-16"
                        type="button"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default CancelPolicyForm;
