import { useLazyQuery, useQuery } from "@apollo/client";

import { GET_PRICE_PLANS } from "src/apollo/queries/space.queries";

export type TUseCalculateSpacePriceProps = {
    fromDateTime?: any;
    duration?: any;
    durationType?: any;
    spaceId?: any;
};
const useCalculateSpacePrice = ({
    fromDateTime,
    duration,
    durationType,
    spaceId,
}: TUseCalculateSpacePriceProps) => {
    const {
        loading: calculatingPrice,
        data: applicablePP,
        error: priceCalculationError,
    } = useQuery(GET_PRICE_PLANS, {
        skip: !fromDateTime || !duration || !durationType || !spaceId,
        variables: {
            input: { fromDateTime, duration, durationType, spaceId },
        },
    });

    return {
        calculatingPrice,
        calculatedPrice: applicablePP?.getApplicablePricePlans,
        priceCalculationError,
    };
};

export default useCalculateSpacePrice;
