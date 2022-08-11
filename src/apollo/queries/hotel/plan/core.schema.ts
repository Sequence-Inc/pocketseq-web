import { PHOTO, HOTLE_ROOM, BASICE_PRICE_SETTINGS } from "../../core.queries";

export const PACKAGE_PLAN = `
    id
    name
    description
    paymentTerm
    stock
    startUsage
    endUsage
    startReservation
    endReservation
    cutOffBeforeDays
    cutOffTillTime
    hotelId
    isBreakfastIncluded
    photos{
        ${PHOTO}
    }
    roomTypes{
        id
        hotelRoom {
            ${HOTLE_ROOM}
        }
        priceSettings{
            ${BASICE_PRICE_SETTINGS}
        }
        createdAt
        updatedAt
    }
    includedOptions{
        id
        name
    }
    additionalOptions{
        id
        name
    }
    cancelPolicy{
        id
    }
    createdAt
    updatedAt
`;
