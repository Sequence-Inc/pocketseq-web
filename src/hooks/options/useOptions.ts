import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

const useOptions = () => {
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
        reset,
    } = useForm();

    const watchShowUsage = watch("usagePeriod", false);
    const watchShowReservation = watch("reservationPeriod", false);
    const watchShowCutOff = watch("cutOffPeriod", false);
    const watchAdditionalPrice = watch("additionalPrice", false);

    useEffect(() => {
        if (!watchShowUsage) {
            reset({
                ...getValues(),
                startUsage: undefined,
                endUsage: undefined,
            });
            unregister(["startUsage", "endUsage"]);
        }
        if (watchShowUsage) {
            register("startUsage", { required: true });

            register("endUsage", { required: true });
        }
    }, [watchShowUsage]);

    useEffect(() => {
        if (!watchAdditionalPrice) {
            reset({
                ...getValues(),
                costOption: undefined,
                cost: undefined,
            });
            unregister(["costOption", "cost"]);
        }
        if (watchAdditionalPrice) {
            register("costOption", { required: true });
            register("cost", { required: true });
        }
    }, [watchAdditionalPrice]);

    useEffect(() => {
        if (!watchShowReservation) {
            reset({
                ...getValues(),
                startReservation: undefined,
                endReservation: undefined,
            });
            unregister(["startReservation", "endReservation"]);
        }
        if (watchShowReservation) {
            register("startReservation", { required: true });
            register("endReservation", { required: true });
        }
    }, [watchShowReservation]);

    useEffect(() => {
        if (!watchShowCutOff) {
            reset({
                ...getValues(),
                cutOffBeforeDays: undefined,
                cutOffTillTime: undefined,
            });
            unregister(["cutOffBeforeDays", "cutOffTillTime"]);
        }
        if (watchShowCutOff) {
            register("cutOffBeforeDays", { required: true });
            register("cutOffTillTime", { required: true });
        }
    }, [watchShowCutOff]);

    return {
        loading,
        register,
        unregister,
        control,
        errors,
        dirtyFields,
        watch,
        setValue,
        handleSubmit,
        getValues,
        watchShowUsage,
        watchShowReservation,
        watchShowCutOff,
        watchAdditionalPrice,
    };
};

export default useOptions;
