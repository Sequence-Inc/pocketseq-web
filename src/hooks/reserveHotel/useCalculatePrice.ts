import { useCallback, useState } from "react";
import { queries as ReserveHotelQueries } from "src/apollo/queries/reserveHotel";
import { useLazyQuery } from "@apollo/client";
import useReduceObject from "@hooks/useFilterObject";

type TCalculatePriceProps = {
    roomPlanId?: string;
    checkInDate?: any;
    checkOutDate?: any;
    nAdult?: number;
    nChild?: number;
    additionalOptionsFields?: any[];
};

const useCalculatePrice = () => {
    const [loading, setLoading] = useState(false);

    const [priceData, setPriceData] = useState(null);
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

    const [calculatePriceWithAuth] = useLazyQuery(
        ReserveHotelQueries.CALCULATE_ROOM_PRICE_PLAN_WITH_AUTH,
        {
            fetchPolicy: "network-only",
        }
    );

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
            setLoading(true);
            const data = await calculatePrice({
                variables: {
                    input: calculatePriceInput,
                },
            });

            if (data?.data?.calculateRoomPlanPrice) {
                setPriceData(data.data.calculateRoomPlanPrice);
            }
            console.log("without auth", {
                data: data.data.calculateRoomPlanPrice,
            });
            setLoading(false);
        },
        []
    );

    const fetchCalculatePriceWithAuth = useCallback(
        async (props: TCalculatePriceProps & { useSubscription?: boolean }) => {
            const { additionalOptionsFields, useSubscription, ...rest } = props;

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

                useSubscription: !!useSubscription,
            };

            setLoading(true);

            const data = await calculatePriceWithAuth({
                variables: {
                    input: calculatePriceInput,
                },
            });

            if (data?.data?.calculateRoomPlanPriceWithAuth) {
                setPriceData(data.data.calculateRoomPlanPriceWithAuth);
            }
            console.log("with auth", {
                data: data.data.calculateRoomPlanPriceWithAuth,
            });

            setLoading(false);
        },
        []
    );

    return {
        fetchCalculatedPrice,
        priceCalculation,
        calculatingPrice,
        priceCalculationError,
        fetchCalculatePriceWithAuth,
        loading,
        priceData,
    };
};

export default useCalculatePrice;
