export type SubscriptionCategoryType = "A" | "B" | "C";

export const SUBSCRIPTION_PRICE_OBJECT = `
    id
    amount
    currency
    name
    priceRange
`;
export type SubscriptionPrice = {
    id: string;
    amount: number;
    currency: string;
    name: SubscriptionCategoryType;
    priceRange: string;
};

export const SUBSCRIPTION_PRODUCT_OBJECT = `
    id
    name
    title
    type
    unit
    prices {
        ${SUBSCRIPTION_PRICE_OBJECT}
    }
`;

export type SubscriptionProduct = {
    id: string;
    name: string;
    title: string;
    type: "rental-space" | "hotel";
    unit: string;
    price: SubscriptionPrice;
    prices: SubscriptionPrice[];
};

export const SUBSCRIPTION_OBJECT = `
    id
    amount
    canceledAt
    currentPeriodEnd
    currentPeriodStart
    endsAt
    isCanceled
    name
    priceType
    remainingUnit
    type
    unit
`;
