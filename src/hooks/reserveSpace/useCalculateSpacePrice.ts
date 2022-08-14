import { useCallback } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";

import { GET_PRICE_PLANS } from "src/apollo/queries/space.queries";
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
};
const useCalculateSpacePrice = () => {
    const [
        calculatePrice,
        {
            loading: calculatingPrice,
            data: applicablePP,
            error: priceCalculationError,
        },
    ] = useLazyQuery(GET_PRICE_PLANS);

    const fetchCalculatedPrice = useCallback(
        async (props: TUseCalculateSpacePriceProps) => {
            console.log({ props });

            const { additionalOptionsFields, ...rest } = props;

            const input = useReduceObject(rest, Calculate_Price_Inputs);

            console.log({ input });
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
            await calculatePrice({
                variables: {
                    input: calculatePriceInput,
                },
            });
        },
        []
    );

    return {
        fetchCalculatedPrice,
        calculatingPrice,
        calculatedPrice: applicablePP?.getApplicablePricePlans,
        priceCalculationError,
    };
};

export default useCalculateSpacePrice;
