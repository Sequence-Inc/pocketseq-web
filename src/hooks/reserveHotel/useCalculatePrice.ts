import { useCallback } from "react";
import { queries as ReserveHotelQueries } from "src/apollo/queries/reserveHotel";
import { useLazyQuery } from "@apollo/client";

type TCalculatePriceProps = {
    roomPlanId?: string;
    checkInDate?: any;
    checkOutDate?: any;
    nAdult?: number;
    nChild?: number;
    additionalOptionsFields?: any[];
};

const useCalculatePrice = () => {
    const [
        calculatePrice,
        {
            data: priceCalculation,
            loading: calculatingPrice,
            error: priceCalculationError,
        },
    ] = useLazyQuery(ReserveHotelQueries.CALCULATE_ROOM_PRICE_PLAN, {
        fetchPolicy: "network-only",
    });

    const fetchCalculatedPrice = useCallback(
        async (props: TCalculatePriceProps) => {
            let calculatePriceInput = {
                roomPlanId: props?.roomPlanId,
                nAdult: props?.nAdult,
                nChild: props?.nChild,
                checkInDate: props?.checkInDate?.startOf("day").valueOf(),
                checkOutDate: props?.checkOutDate?.startOf("day").valueOf(),
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
        priceCalculation,
        calculatingPrice,
        priceCalculationError,
    };
};

export default useCalculatePrice;
