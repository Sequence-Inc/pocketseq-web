import { gql } from "@apollo/client";

export const RESERVE_HOTEL_ROOM = gql`
    mutation ReserveHotelRoom($input: ReserveHotelRoomInput!) {
        reserveHotelRoom(input: $input) {
            amount
            currency
            description
            intentCode
            intentId
            paymentMethodTypes
            reservationId
            transactionId
            subscriptionPrice
            subscriptionUnit
        }
    }
`;
