import { gql, useMutation, useQuery } from "@apollo/client";
import { useToast } from "@hooks/useToasts";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import {
    queries as CancelPolicyQueires,
    mutation as CancelPolicyMutaions,
} from "src/apollo/queries/cancelPolicies";

const useAddCancelPolicy = () => {
    const { addAlert } = useToast();
    const [loading, setLoading] = useState(false);
    const {
        register,
        unregister,
        control,
        formState: { errors },
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

    const { data: spaces, loading: spacesLoading } = useQuery(
        CancelPolicyQueires.MY_SPACES
    );
    const { data: hotels, loading: hotelsLoading } = useQuery(
        CancelPolicyQueires.MY_HOTELS
    );

    const onSubmit = handleSubmit(async (formData) => {
        setLoading(true);

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
        append({ beforeHours: null, percentage: null, isLoading: false });
    }, []);

    return {
        register,
        unregister,
        control,
        errors,
        watch,
        setValue,
        handleSubmit,
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
        loading,
        onAddPolciesField,
        onRemovePoliciesField,
    };
};

export default useAddCancelPolicy;
