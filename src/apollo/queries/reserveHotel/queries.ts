import { gql } from "@apollo/client";

export const CALCULATE_ROOM_PRICE_PLAN = gql`
    query CalculateRoomPricePlan($input: CalculateRoomPlanInput!) {
        calculateRoomPlanPrice(input: $input) {
            appliedRoomPlanPriceSettings
            appliedRoomPlanPriceOverrides
            totalAmount
            planAmount
        }
    }
`;

export const CALCULATE_ROOM_PRICE_PLAN_WITH_AUTH = gql`
    query CalculateRoomPlanPriceWithAuthInput(
        $input: CalculateRoomPlanPriceWithAuthInput!
    ) {
        calculateRoomPlanPriceWithAuth(input: $input) {
            appliedRoomPlanPriceSettings
            appliedRoomPlanPriceOverrides
            subscriptionUnit
            subscriptionAmount
            totalAmount
            planAmount
        }
    }
`;
