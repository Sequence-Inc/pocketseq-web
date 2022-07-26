import { gql, useMutation, useQuery } from "@apollo/client";
import useReduceObject from "@hooks/useFilterObject";
import { useToast } from "@hooks/useToasts";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import {
    queries as CancelPolicyQueires,
    mutation as CancelPolicyMutaions,
    mutation,
} from "src/apollo/queries/cancelPolicies";
import { TCancelPolicy } from "@appTypes/timebookTypes";

const POLICY_FIELD_KEYS = ["beforeHours", "percentage"];

type OnCreateOptionsTypes = {
    onCompleted?: Function;
    onError?: Function;
};

type TuseAddCancelPolicyProps = {
    onCreateOptions?: OnCreateOptionsTypes;
    initialValue?: TCancelPolicy;
};

const useAddCancelPolicy = ({
    initialValue = null,
    onCreateOptions = {},
}: TuseAddCancelPolicyProps) => {
    const [loading, setLoading] = useState(false);
    const { addAlert } = useToast();
    const {
        register,
        unregister,
        control,
        formState: { errors, dirtyFields },
        watch,
        setValue,
        handleSubmit,
        getValues,
    } = useForm();

    const {
        fields: policiesField,
        append,
        update,
        remove,
    } = useFieldArray({
        control,
        name: "policies",
        keyName: "policyId",
    });

    const [createNewCancelPolicy] = useMutation(
        CancelPolicyMutaions.ADD_CANCEL_POLICIES,
        {
            refetchQueries: [{ query: CancelPolicyQueires.MY_CANCEL_POLICIES }],
            onCompleted: (data) => {
                setLoading(false);

                onCreateOptions?.onCompleted(data);
            },
            onError: (err) => {
                setLoading(false);
                onCreateOptions?.onError(err);
            },
        }
    );

    const [updateCancelPolicy] = useMutation(
        CancelPolicyMutaions.UPDATE_CANCEL_POLICIES,
        {
            refetchQueries: [
                {
                    query: CancelPolicyQueires.CANCEL_POLICY_BY_ID,
                    variables: {
                        id: initialValue?.id,
                    },
                },
            ],

            onCompleted: (data) => {
                addAlert({
                    type: "success",
                    message: "Updated policy successfully",
                });
                setLoading(false);
            },
            onError: (err) => {
                setLoading(false);
                addAlert({
                    type: "error",
                    message: "Could not updated policy",
                });
            },
        }
    );

    const onCreate = useCallback(async (formData) => {
        const { policies, ...rest } = formData;

        const formatedPolcies = policies
            .map((policiy) => useReduceObject(policiy, POLICY_FIELD_KEYS))
            .map((reduced) => ({
                beforeHours: parseFloat(reduced.beforeHours),
                percentage: parseFloat(reduced.percentage),
            }));

        return createNewCancelPolicy({
            variables: { input: { ...rest, rates: formatedPolcies } },
        });
    }, []);

    const onUpdate = useCallback(
        async (formData) => {
            const { policies, ...rest } = formData;

            const formatedPolcies = policies
                .map((policiy) => useReduceObject(policiy, POLICY_FIELD_KEYS))
                .map((reduced) => ({
                    beforeHours: parseFloat(reduced.beforeHours),
                    percentage: parseFloat(reduced.percentage),
                }));

            return updateCancelPolicy({
                variables: {
                    input: {
                        ...rest,
                        id: initialValue?.id,
                        rates: formatedPolcies,
                    },
                },
            });
        },
        [initialValue]
    );

    const onSubmit = handleSubmit(async (formData) => {
        setLoading(true);
        if (!initialValue) {
            return onCreate(formData);
        }
        if (initialValue) {
            return onUpdate(formData);
        }
    });

    const onAddPolciesField = useCallback(
        (field?: { beforeHours?: number; percentage?: number }) => {
            append({
                beforeHours: field?.beforeHours || null,
                percentage: field?.percentage || null,
                isLoading: false,
            });
        },
        []
    );

    const onRemovePoliciesField = useCallback((fiedlIndex) => {
        remove(fiedlIndex);
    }, []);

    useEffect(() => {
        if (!initialValue) {
            append(
                { beforeHours: null, percentage: null, isLoading: false },
                { shouldFocus: false }
            );
        }
        if (initialValue) {
            setValue("name", initialValue.name);
            setValue("description", initialValue.description);
            if (initialValue?.rates?.length) {
                [...initialValue.rates]
                    .sort((a, b) => a?.createdAt - b?.createdAt)
                    ?.map((rate, index) =>
                        update(index, {
                            ...rate,
                            isLoading: false,
                        })
                    );
            }
        }
    }, [initialValue]);

    return {
        register,
        unregister,
        control,
        errors,
        dirtyFields,
        watch,
        setValue,
        handleSubmit,
        onSubmit,
        getValues,
        policiesField,
        append,
        update,
        remove,
        loading,
        onAddPolciesField,
        onRemovePoliciesField,
    };
};

export default useAddCancelPolicy;
