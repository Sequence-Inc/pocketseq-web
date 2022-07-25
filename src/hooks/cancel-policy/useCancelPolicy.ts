import { gql, useMutation, useQuery } from "@apollo/client";
import { useToast } from "@hooks/useToasts";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export const MY_SPACES = gql`
    query MySpaces {
        mySpaces {
            id
            name
        }
    }
`;

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

    const { fields, append, update, remove } = useFieldArray({
        control,
        name: "policies",
        keyName: "policyId",
    });

    const { data: spaces, loading: spacesLoading } = useQuery(MY_SPACES);

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
        spaces,
        spacesLoading,
    };
};

export default useAddCancelPolicy;
