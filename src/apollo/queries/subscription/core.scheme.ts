export const SUBSCRIPTION_OBJECT = `
   id
   amount
   currentPeriodEnd
   currentPeriodStart
   name
   remainingUnit
   type
   unit
`;

export const SUBSCRIPTION_PRODUCT_OBJECT = `
    id
    name
    title
    type
    unit
    prices{
        ${SUBSCRIPTION_OBJECT}
    }
`;
