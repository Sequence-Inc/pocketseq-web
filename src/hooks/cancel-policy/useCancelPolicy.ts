import { gql, useMutation, useQuery } from "@apollo/client";
import { useToast } from "@hooks/useToasts";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

const useAddCancelPolicy = (fn, initialValue) => {
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

    const { fields, append, update, remove } = useFieldArray({
        control,
        name: "policies",
        keyName: "policyId",
    });

    return {
        register,
        unregister,
        control,
        errors,
        watch,
        setValue,
        handleSubmit,
        getValues,
        fields,
        append,
        update,
        remove,
    };
};
