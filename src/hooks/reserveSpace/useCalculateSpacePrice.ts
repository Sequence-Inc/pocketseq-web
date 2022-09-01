import { useCallback, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";

import {
    GET_PRICE_PLANS,
    GET_PRICE_PLANS_WITH_AUTH,
} from "src/apollo/queries/space.queries";
import useReduceObject from "@hooks/useFilterObject";
import * as yup from "yup";

const Calculate_Price_Inputs = [
    "duration",
    "durationType",
    "fromDateTime",
    "spaceId",
    // "additionalOptionsFields",
];

const CALCULATE_PRICE_SCHEME = yup.object().shape({
    duration: yup.string().required(),
    durationType: yup.string().required(),
    fromDateTime: yup.number().required(),
    spaceId: yup.string().required(),
    // additionalOptionsFields: yup.array().optional(),
});

export type TUseCalculateSpacePriceProps = {
    fromDateTime?: any;
    duration?: any;
    durationType?: any;
    spaceId?: any;
    additionalOptionsFields?: any[];
    useSubscription?: boolean;
};

const useCalculateSpacePrice = () => {
    const [loading, setLoading] = useState(false);

    const [priceData, setPriceData] = useState(null);
    const [
        calculatePrice,
        {
            loading: calculatingPrice,
            data: applicablePP,
            error: priceCalculationError,
        },
    ] = useLazyQuery(GET_PRICE_PLANS);

    const [calculatePriceWithAuth] = useLazyQuery(GET_PRICE_PLANS_WITH_AUTH);

    const fetchCalculatedPrice = useCallback(
        async (props: TUseCalculateSpacePriceProps) => {
            const { additionalOptionsFields, ...rest } = props;
            setPriceData(null);
            const input = useReduceObject(rest, Calculate_Price_Inputs);
            const isValid = await CALCULATE_PRICE_SCHEME.isValid(input);
            if (!isValid) return;
            let calculatePriceInput = {
                ...input,
                additionalOptions: props?.additionalOptionsFields
                    ?.filter((item) => item?.isChecked)
                    ?.map((field) => ({
                        optionId: field?.id,
                        quantity: field.quantity,
                    })),
            };

            setLoading(true);

            const data = await calculatePrice({
                variables: {
                    input: calculatePriceInput,
                },
            });

            if (data?.data?.getApplicablePricePlans) {
                setPriceData(data.data.getApplicablePricePlans);
            }

            setLoading(false);
        },
        []
    );

    const fetchCalculatedPriceWithAuth = useCallback(
        async (props: TUseCalculateSpacePriceProps) => {
            const { additionalOptionsFields, useSubscription, ...rest } = props;
            setPriceData(null);
            const input = useReduceObject(rest, Calculate_Price_Inputs);
            const isValid = await CALCULATE_PRICE_SCHEME.isValid(input);
            if (!isValid) return;
            let calculatePriceInput = {
                ...input,
                useSubscription,
                additionalOptions: props?.additionalOptionsFields
                    ?.filter((item) => item?.isChecked)
                    ?.map((field) => ({
                        optionId: field?.id,
                        quantity: field.quantity,
                    })),
            };

            setLoading(true);

            const data = await calculatePriceWithAuth({
                variables: {
                    input: calculatePriceInput,
                },
            });

            if (data?.data?.getApplicablePricePlansWithAuth) {
                setPriceData(data.data.getApplicablePricePlansWithAuth);
            }

            setLoading(false);
        },
        []
    );
    return {
        fetchCalculatedPrice,
        fetchCalculatedPriceWithAuth,
        loading,
        calculatingPrice,
        calculatedPrice: applicablePP?.getApplicablePricePlans,
        priceCalculationError,
        priceData,
    };
};

export default useCalculateSpacePrice;
