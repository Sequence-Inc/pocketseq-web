import { gql } from "@apollo/client";

export const CALCULATE_ROOM_PRICE_PLAN = gql`
    query CalculateRoomPricePlan($input: CalculateRoomPlanInput!) {
        calculateRoomPlanPrice(input: $input) {
            appliedRoomPlanPriceSettings
            appliedRoomPlanPriceOverrides
            totalAmount
        }
    }
`;
