import { useCallback, useEffect, useState } from "react";
import { queries as ReserveHotelQueries } from "src/apollo/queries/reserveHotel";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";

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
            console.log({ props });

            let calculatePriceInput = {
                roomPlanId: props?.roomPlanId,
                nAdult: props?.nAdult,
                nChild: props?.nChild,
                checkInDate: props?.checkInDate?.startOf("day").valueOf(),
                checkOutDate: props?.checkOutDate?.startOf("day").valueOf(),
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
