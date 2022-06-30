import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { AVAILABLE_PREFECTURES } from "src/apollo/queries/admin.queries";

const useAddGeneral = (fn) => {
    const [zipCode, setZipCode] = useState("");
    const [cache, setCache] = useState({});

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
    const { data: prefectures } = useQuery(AVAILABLE_PREFECTURES);
    const onSubmit = handleSubmit(async (formData) => {
        console.log({ formData });
    });

    return {
        register,
        unregister,
        control,
        errors,
        watch,
        setValue,
        onSubmit,
        getValues,
        zipCode,
        setZipCode,
        cache,
        setCache,
        prefectures,
    };
};

export default useAddGeneral;
