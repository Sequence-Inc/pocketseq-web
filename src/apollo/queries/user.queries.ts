import { gql } from "@apollo/client";
import { COMPANY_ACCOUNT, USER_ACCOUNT } from "./core.queries";

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
        paymentSource{
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
