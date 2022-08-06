import { useCallback, useEffect, useState } from "react";
import { mutations as ReserveHotelMutations } from "src/apollo/queries/reserveHotel";
import { queries as OptionQueries } from "src/apollo/queries/options";
import { gql, useMutation, useQuery } from "@apollo/client";
import { OPTION_OBJECT } from "src/apollo/queries/options/core.scheme";
import { useFieldArray, useForm } from "react-hook-form";

const GET_PACKAGE_PLAN_BY_ID = gql`
    query PackagePlanById($id: ID!) {
        packagePlanById(id: $id) {
            additionalOptions {
                id
                additionalPrice
                name
                paymentTerm
            }
        }
    }
`;

// {
//     paymentSourceId,
//     roomPlanId,
//     checkInDate,
//     checkOutDate,
//     nAdult,
//     nChild,
//     additionalOptions
// }

type TReserveHotelProps = {
    paymentSourceId?: string;
    checkInDate?: any;
    checkOutDate?: any;
    nAdult?: number;
    nChild?: number;
    plan?: string;
    roomPlanId?: string;
};

const useReserveHotel = (formData: TReserveHotelProps) => {
    const { data: planDetails, loading: fetchingPlanDetails } = useQuery(
        GET_PACKAGE_PLAN_BY_ID,
        {
            fetchPolicy: "network-only",
            skip: !formData?.plan,
            variables: {
                id: formData?.plan,
            },
        }
    );
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

    const [reserveHotelSpace] = useMutation(
        ReserveHotelMutations.RESERVE_HOTEL_ROOM
    );

    const {
        fields: additionalOptionsFields,
        update: updateAdditionalOptionsFields,
    } = useFieldArray({
        keyName: "additionalOptionFieldId",
        name: "additionalOptions",
        control,
    });

    const initializeAdditionalOptions = useCallback(() => {
        if (!planDetails?.packagePlanById?.additionalOptions?.length) return;

        planDetails?.packagePlanById?.additionalOptions?.forEach(
            (additionalOption, index) => {
                updateAdditionalOptionsFields(index, {
                    id: additionalOption?.id,
                    name: additionalOption?.name,
                    paymentTerm: additionalOption.paymentTerm,
                    additionalPrice: additionalOption.additionalPrice,
                    isChecked: false,
                });
            }
        );
    }, [planDetails]);

    const onAdditionalOptionsCheckboxAction = useCallback(
        (optionIndex, val) => {
            updateAdditionalOptionsFields(optionIndex, {
                ...additionalOptionsFields[optionIndex],
                isChecked: val,
            });
        },
        [additionalOptionsFields]
    );

    // const onReserveHotel = useCallback(async()=>{},[])

    useEffect(initializeAdditionalOptions, [initializeAdditionalOptions]);
    useEffect(() => {
        if (formData) {
            setValue("paymentSourceId", formData.paymentSourceId);
            setValue("checkInDate", formData.checkInDate);
            setValue("checkOutDate", formData.checkOutDate);
            setValue("nAdult", formData.nAdult);
            setValue("nChild", formData.nChild);
            setValue("plan", formData.plan);
            setValue("roomPlanId", formData.roomPlanId);
        }
    }, [formData]);

    return {
        register,
        unregister,
        control,
        errors,
        watch,
        setValue,
        handleSubmit,
        getValues,
        onAdditionalOptionsCheckboxAction,
        additionalOptionsFields,
    };
};

export default useReserveHotel;
