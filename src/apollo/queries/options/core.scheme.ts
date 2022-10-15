import { PHOTO } from "../core.queries";

export const OPTION_OBJECT = `
    id
    name
    description
    startUsage
    endUsage
    startReservation
    endReservation
    cutOffBeforeDays
    cutOffTillTime
    paymentTerm
    additionalPrice
    photos{
        ${PHOTO}
    }
    stock
    createdAt
    updatedAt
`;
