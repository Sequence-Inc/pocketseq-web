import React from "react";
import { SubscriptionCategoryType } from "src/apollo/queries/subscriptions/core.schema";

interface SubscriptionItemsListProps {
    type: "hotel" | "rental-space";
    category: SubscriptionCategoryType;
    numbers?: number;
}

export const SubscriptionItemsList = ({
    type,
    category,
    numbers,
}: SubscriptionItemsListProps) => {
    return (
        <div className={`grid grid-cols-2 sm:grid-cols-${numbers} gap-4`}>
            {type}
        </div>
    );
};
