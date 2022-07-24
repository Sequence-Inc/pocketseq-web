import { gql, useMutation, useQuery } from "@apollo/client";
import { useToast } from "@hooks/useToasts";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    useFieldArray,
    useForm,
    UseFormProps,
    UseFieldArrayReturn,
    FieldArrayWithId,
} from "react-hook-form";
import { Pricing } from "src/apollo/queries/hotel";
import {
    DAY_OF_WEEK,
    PRICE_SCHEME_ADULTS,
    PRICE_SCHEME_CHILD,
    ROOM_CHARGE_KEY,
} from "src/config";

import useReduceObject from "@hooks/useFilterObject";

const { queries: pricingQueries, mutations: pricingMutations } = Pricing;

type TOptions = {
    onCompleted?: Function;
    onError?: Function;
    refetchQueries?: any;
    awaitRefetchQueries?: boolean;
};
type AddPriceShcemaProps = {
    hotelId: string;
    initialValue?: any;
    options?: TOptions;
    setDefaultValues?: any;
};

export const AddPriceSchemaInputKeys = [
    ROOM_CHARGE_KEY,
    ...PRICE_SCHEME_ADULTS.map((item) => item.key),
    ...PRICE_SCHEME_CHILD.map((item) => item.key),
];

const useAddPriceScheme = (props: AddPriceShcemaProps) => {
    const { hotelId, initialValue, options, setDefaultValues } = props;

    const [loading, setLoading] = useState<boolean>(false);
    const {
        register,
        unregister,
        control,
        formState: { errors, isDirty, dirtyFields },
        watch,
        setValue,
        handleSubmit,
        getValues,
        trigger,
        setError,
        reset,
        resetField,
    } = useForm();

    const { addAlert } = useToast();

    const [mutate] = useMutation(pricingMutations.ADD_PRICING_SCHEME, {
        onCompleted: (data) => options.onCompleted(data),
    });

    useEffect(() => {
        if (!initialValue) return;
        reset(initialValue);
    }, [initialValue]);

    const [updatePricingScheme] = useMutation(
        pricingMutations.UPDATE_PRICING_SHCEME,
        {
            ...options,
            onCompleted: (data) => {
                addAlert({
                    type: "success",
                    message: "Updated Pricing Scheme",
                });
                reset(data?.addPriceScheme?.priceScheme);
                setDefaultValues(data?.addPriceScheme?.priceScheme);
                setLoading(false);
            },
            onError: (error) => {
                addAlert({
                    type: "error",
                    message: "Could not update Pricing Scheme",
                });

                setLoading(false);
            },
        }
    );

    const onSubmit = handleSubmit(async (formData) => {
        setLoading(true);

        // This piece of code filter all the unnecessary keys & values on formData and

        let payload = useReduceObject(formData, AddPriceSchemaInputKeys);

        const { data, errors } = await mutate({
            variables: { hotelId, input: payload },
        });
        if (data) {
            reset(data);
            addAlert({ type: "success", message: "Added new price scheme" });
        }
        if (errors) {
            reset();
            addAlert({
                type: "error",
                message: "Could not add new price scheme",
            });
        }
        setLoading(false);
    });

    // const onUpdate = handleSubmit(async (formData) => {
    //     setLoading(true);

    //     let payload = Object.entries(
    //         Object.fromEntries(
    //             AddPriceSchemaInputKeys.map((key) => [key, formData[key]])
    //         )
    //     ).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {});

    //     payload = {
    //         ...payload,
    //         id: initialValue?.id,
    //     };
    //     await updatePricingScheme({
    //         variables: { input: payload },
    //     });
    // });

    return {
        register,
        unregister,
        loading,
        control,
        errors,
        isDirty,
        watch,
        setValue,
        handleSubmit,
        getValues,
        onSubmit,
        trigger,
        setError,
        dirtyFields,
        reset,
        resetField,
        // onUpdate,
    };
};

export default useAddPriceScheme;
