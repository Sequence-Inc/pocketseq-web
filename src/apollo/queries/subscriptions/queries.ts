import { gql } from "@apollo/client";
import { SUBSCRIPTION_PRODUCT_OBJECT } from "./core.schema";

export const ALL_SUBSCRIPTION_PRODUCTS = gql`
    query AllSubscriptionProducts {
        allSubscriptionProducts {
            ${SUBSCRIPTION_PRODUCT_OBJECT}
        }
    }
`;
