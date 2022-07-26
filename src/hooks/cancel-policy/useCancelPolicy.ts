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

const POLICY_FIELD_KEYS = ["beforeHours", "percentage"];

type OnCreateOptionsTypes = {
    onCompleted?: Function;
    onError?: Function;
};

const useAddCancelPolicy = ({
    onCreateOptions = {},
}: {
    onCreateOptions: OnCreateOptionsTypes;
}) => {
    const [loading, setLoading] = useState(false);
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

    const onSubmit = handleSubmit(async (formData) => {
        setLoading(true);
        await onCreate(formData);
        setTimeout(() => setLoading(false), 1500);
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
        append(
            { beforeHours: null, percentage: null, isLoading: false },
            { shouldFocus: false }
        );
    }, []);

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
