import { gql } from "@apollo/client";
import { SUBSCRIPTION_OBJECT } from "./core.scheme";

export const CREATE_SUBSCRIPTION = gql`
    mutation CreateSubscription($priceId:ID!){
        createSubscription(priceId:$priceId){
        message
        subcription {
            ${SUBSCRIPTION_OBJECT}
        }
        }
    }
`;

export const CANCEL_SUBSCRIPTION = gql`
    mutation CancelSubscription($id: ID!) {
        cancelSubscription(id: $id) {
            message
        }
    }
`;
