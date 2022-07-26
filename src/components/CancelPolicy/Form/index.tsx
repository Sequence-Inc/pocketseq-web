import { TextField, Button, TextArea, FormConfirmModal } from "@element";
import { useCancelPolicy } from "@hooks/cancel-policy";
import { useToast } from "@hooks/useToasts";
import { useRouter } from "next/router";
import React, { useMemo, useRef, useCallback } from "react";
import { XIcon } from "@heroicons/react/outline";
import { useQuery } from "@apollo/client";
import { queries as CancelPolicyQueries } from "src/apollo/queries/cancelPolicies";

type TCancelPolicyFormProps = {
    cancelPolicyId?: string;
};

const CancelPolicyForm = (props: TCancelPolicyFormProps) => {
    const router = useRouter();
    const { addAlert } = useToast();
    const confirmModal = useRef(null);

    const {
        data: initialValue,
        loading: fetchingPolicy,
        error: fetchPolicyError,
    } = useQuery(CancelPolicyQueries.CANCEL_POLICY_BY_ID, {
        skip: !props?.cancelPolicyId,
        variables: {
            id: props?.cancelPolicyId,
        },
    });

    const onCreateOptions = useMemo(
        () => ({
            onCompleted: (data) => {
                addAlert({ type: "success", message: "Added cancel policy" });
                setTimeout(() => router.push("/host/cancelPolicies"), 1500);
            },
            onError: (err) => {
                addAlert({
                    type: "error",
                    message: "Could not add cancel policy",
                });
            },
        }),
        [addAlert]
    );

    const onRemoveOptions = useMemo(
        () => ({
            onCompleted: (data) => {
                addAlert({ type: "success", message: "Removed cancel policy" });
                setTimeout(() => router.push("/host/cancelPolicies"), 1500);
            },
            onError: (err) => {
                addAlert({
                    type: "error",
                    message: "Could not remove cancel policy",
                });
            },
        }),
        []
    );

    const {
        register,
        control,
        errors,
        onSubmit,
        getValues,
        dirtyFields,
        policiesField,
        loading,
        onAddPolciesField,
        onRemovePoliciesField,
        handleRemoveCancelPolicy,
    } = useCancelPolicy({
        onCreateOptions,
        onRemoveOptions,
        initialValue: initialValue?.cancelPolicyById,
    });

    const handleRemove = useCallback(() => {
        confirmModal?.current?.open();
    }, [confirmModal]);

    const onConfirmRemove = useCallback(() => {
        confirmModal?.current?.close();
        return handleRemoveCancelPolicy();
    }, [confirmModal]);
    return (
        <>
            <FormConfirmModal ref={confirmModal} onConfirm={onConfirmRemove}>
                <span>
                    Are you sure you want to remove this cancel policy ?
                </span>
            </FormConfirmModal>
            <form onSubmit={onSubmit}>
                <div className="px-2 py-3 space-y-6 sm:py-6">
                    <div className="w-full md:w-8/12 lg:w-6/12">
                        <p className="text-sm leading-5 font-semibold">Name</p>
                        <TextField
                            label=""
                            {...register("name", {
                                required: true,
                            })}
                            error={errors?.name && true}
                            errorMessage="Name is required"
                            autoFocus
                        />
                    </div>

                    <div className="w-full md:w-8/12 lg:w-6/12">
                        <p className="text-sm leading-5 font-semibold">
                            Description
                        </p>
                        <TextArea
                            label=""
                            rows={4}
                            {...register("description", {
                                required: false,
                            })}
                            error={errors?.description && true}
                            errorMessage="Description is required"
                        />
                    </div>

                    <div className="w-full md:w-8/12 lg:w-8/12">
                        <p className="text-sm  leading-5 font-semibold">
                            Policies
                        </p>
                        {policiesField?.map((field, index) => (
                            <div
                                className="w-full my-3 flex items-end justify-between space-x-2"
                                key={field.policyId}
                            >
                                <div className="flex flex-col flex-1 ">
                                    <p className="text-xs text-gray-500">
                                        Before Hours (hours)
                                    </p>
                                    <TextField
                                        label=""
                                        {...register(
                                            `policies.${index}.beforeHours`,
                                            {
                                                required: true,
                                                min: {
                                                    value: 0,
                                                    message:
                                                        "Value cannot be less than 0 ",
                                                },
                                            }
                                        )}
                                        error={
                                            errors?.policies &&
                                            errors?.policies[index] &&
                                            errors?.policies[index]
                                                .beforeHours &&
                                            true
                                        }
                                        errorMessage={
                                            errors?.policies &&
                                            errors?.policies[index] &&
                                            errors?.policies[index].beforeHours
                                                ?.message
                                        }
                                        step="0.01"
                                        type="number"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="flex flex-col flex-1">
                                    <p className="text-xs text-gray-500">
                                        Percentage (%)
                                    </p>
                                    <TextField
                                        label=""
                                        {...register(
                                            `policies.${index}.percentage`,
                                            {
                                                required: true,
                                                min: {
                                                    value: 0,
                                                    message:
                                                        "Value cannot be less than 0 ",
                                                },
                                                max: {
                                                    value: 100,
                                                    message:
                                                        "Value shouldnot exceed 100",
                                                },
                                            }
                                        )}
                                        error={
                                            errors?.policies &&
                                            errors?.policies[index] &&
                                            errors?.policies[index]
                                                .percentage &&
                                            true
                                        }
                                        errorMessage={
                                            errors?.policies &&
                                            errors?.policies[index] &&
                                            errors?.policies[index].percentage
                                                ?.message
                                        }
                                        step="0.01"
                                        type="number"
                                        disabled={loading}
                                    />
                                </div>
                                <button
                                    className=" max-w-min text-red-500 hover:bg-gray-100 rounded-sm p-2"
                                    onClick={() => onRemovePoliciesField(index)}
                                    type="button"
                                >
                                    <XIcon className="  w-5  h-5" />
                                </button>
                            </div>
                        ))}

                        <Button
                            onClick={() => onAddPolciesField()}
                            type="button"
                        >
                            Add
                        </Button>
                    </div>

                    <div className="w-full md:w-8/12 lg:w-6/12 flex items-center space-x-3 justify-end border-t py-6">
                        <Button
                            variant="primary"
                            className="bg-indigo-600 w-16 hover:bg-indigo-400"
                            type="submit"
                            disabled={loading}
                            loadingText={"Please wait"}
                        >
                            {props?.cancelPolicyId ? "Update" : " Save"}
                        </Button>

                        {props?.cancelPolicyId && (
                            <Button
                                variant="primary"
                                className="bg-red-600 w-16 hover:bg-red-400"
                                type="button"
                                disabled={loading}
                                onClick={handleRemove}
                                loadingText={"Please wait"}
                            >
                                Delete
                            </Button>
                        )}
                        <Button
                            variant="secondary"
                            className="w-16"
                            type="button"
                            disabled={loading}
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default CancelPolicyForm;
