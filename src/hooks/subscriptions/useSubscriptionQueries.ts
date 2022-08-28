import { useQuery } from "@apollo/client";
import { queries as SubscriptionQueries } from "src/apollo/queries/subscription";

export const useFetchAllSubscriptions = () =>
    useQuery(SubscriptionQueries.ALL_SUBSCRIPTION_PRODUCTS);

export const useFetchMySubscriptions = () =>
    useQuery(SubscriptionQueries.MY_SUBSCRIPTIONS);
