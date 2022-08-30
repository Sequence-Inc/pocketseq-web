import { gql } from "@apollo/client";
import { COMPANY_ACCOUNT, PAYMENT_SOURCE, USER_ACCOUNT } from "./core.queries";

export const GET_PROFILE = gql`
    query GetProfile {
        myProfile {
            ${USER_ACCOUNT}
            ${COMPANY_ACCOUNT}
        }
    }
`;

export const GET_PROFILE_FOR_SETTINGS = gql`
    query GetProfileForSettings {
        myProfile {
            ${USER_ACCOUNT}
            ${COMPANY_ACCOUNT}
        }
        ${PAYMENT_SOURCE}
    }
`;

export const UPDATE_USER_PROFILE = gql`
    mutation UpdateMyProfile($input: UpdateMyProfileInput!) {
        updateMyProfile(input: $input) {
            message
            action
        }
    }
`;

export const MAKE_DEFAULT_PAYMENT_SOURCE = gql`
    mutation MakeDefaultPaymentSource($paymentMethodId: ID) {
        setDefaultPaymentMethod(paymentMethodId: $paymentMethodId) {
            message
        }
    }
`;

export const REMOVE_PAYMENT_SOURCE = gql`
    mutation RemovePaymentSource($paymentMethodId: String!) {
        removePaymentMethod(paymentMethodId: $paymentMethodId) {
            message
        }
    }
`;

export const GET_PAYMENT_SOURCES = gql`
    query GetPaymentSources {
        ${PAYMENT_SOURCE}
    }
`;

export const ADD_PAYMENT_METHOD = gql`
    mutation addPaymentMethod($paymentMethodId: String!) {
        addPaymentMethod(paymentMethodId: $paymentMethodId) {
            id
            token
            type
            expMonth
            expYear
            last4
            brand
            country
            customer
        }
    }
`;

export const SETUP_INTENT = gql`
    query SetupIntent {
        setupIntent
    }
`;

export const RESERVE_SPACE = gql`
    mutation ReserveSpace($input: ReserveSpaceInput) {
        reserveSpace(input: $input) {
            transactionId
            intentId
            intentCode
            amount
            description
            currency
            reservationId
        }
    }
`;

export const MY_RESERVATION = gql`
    query MyReservations(
        $spacePaginate: PaginationOption
        $spaceFilter: MyReservationFilter
        $hotelPaginate: PaginationOption
        $hotelFilter: MyHotelRoomReservationFilter
    ) {
        myReservations(paginate: $spacePaginate, filter: $spaceFilter) {
            data {
                id
                fromDateTime
                toDateTime
                status
                createdAt
                updatedAt
                approved
                approvedOn
                space {
                    id
                    name
                }
            }
            paginationInfo {
                hasNext
                hasPrevious
                nextCursor
            }
        }

        myHotelRoomReservation (paginate: $hotelPaginate, filter: $hotelFilter) {
            data {
                id
                reservationId
                fromDateTime
                toDateTime
                status
                createdAt
                updatedAt
                approved
                approvedOn
                hotelRoom{
                    id
                    name
                    description
                }
                packagePlan{
                    id
                    name
                    description
                }
                reservee {
                    ${USER_ACCOUNT}
                    ${COMPANY_ACCOUNT}
                }
                transaction {
                    id
                    amount
                    currency
                    status
                    paymentMethodInfo {
                        brand
                        last4
                        country
                        expYear
                        expMonth
                    }
                }
            }
            paginationInfo {
                hasNext
                hasPrevious
                nextCursor
            }
        }
    }
`;
