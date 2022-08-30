import { gql } from "@apollo/client";
import {
    SUBSCRIPTION_PRODUCT_OBJECT,
    SUBSCRIPTION_OBJECT,
} from "./core.scheme";

export const ALL_SUBSCRIPTION_PRODUCTS = gql`
    query AllSubscriptionProducts {
        allSubscriptionProducts {
            ${SUBSCRIPTION_PRODUCT_OBJECT}
        }
    }
`;

export const MY_SUBSCRIPTIONS = gql`
    query MySubscriptions{
        mySubscriptions{
        ${SUBSCRIPTION_OBJECT}
        }
    }
`;
