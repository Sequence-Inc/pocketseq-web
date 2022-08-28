import { gql } from "@apollo/client";
import {
    SUBSCRIPTION_OBJECT,
    SUBSCRIPTION_PRODUCT_OBJECT,
} from "./core.schema";

export const ALL_SUBSCRIPTION_PRODUCTS = gql`
    query AllSubscriptionProducts {
        allSubscriptionProducts {
            ${SUBSCRIPTION_PRODUCT_OBJECT}
        }
    }
`;

export const MY_SUBSCRIPTIONS = gql`
    query MySubscriptions {
        mySubscriptions {
            ${SUBSCRIPTION_OBJECT}
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
