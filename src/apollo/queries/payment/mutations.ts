import { gql } from "@apollo/client";

export const SET_DEFAULT_PAYMENT = gql`
    mutation SetDefaultPayment($paymentMethodId: ID!) {
        setDefaultPaymentMethod(paymentMethodId: $paymentMethodId) {
            message
            action
        }
    }
`;
