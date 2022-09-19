export const IMAGE = `
    url
    height
    width
`;

export const PROFILE_PHOTO = `
    id
    mime
    thumbnail {
        ${IMAGE}
    }
    medium {
        ${IMAGE}
    }
`;

export const PHOTO = `
    id
    mime
    thumbnail {
        ${IMAGE}
    }
    small {
        ${IMAGE}
    }
    medium {
        ${IMAGE}
    }
    large {
        ${IMAGE}
    }
`;

export const STRIPE_ACCOUNT = `
    message
    url
    balance {
        available {
            currency
            amount
        }
        pending {
            currency
            amount
        }
    }
`;

export const PREFECTURE = `
    id
    name
    nameKana
    nameRomaji
    available
`;

export const ADDRESS = `
    id
    addressLine1
    addressLine2
    city
    longitude
    latitude
    postalCode
    prefecture {
        ${PREFECTURE}
    }
`;

export const HOST = `
    id
    type
    name
    approved
    photoId {
        ${PHOTO}
    }
    profilePhoto {
        ${PHOTO}
    }
    stripeAccountId
    stripeAccount {
        ${STRIPE_ACCOUNT}
    }
    license {
        id
        type
        approved
        remarks
        photos {
            ${PHOTO}
        }
        createdAt
        updatedAt
    }
    createdAt
    updatedAt

`;

export const USER_ACCOUNT = `
    ...on UserProfile {
        id
        accountId
        firstName
        lastName
        firstNameKana
        lastNameKana
        roles
        email
        phoneNumber
        emailVerified
        profilePhoto {
            ${PROFILE_PHOTO}
        }
        address {
            ${ADDRESS}
        }
        host {
            ${HOST}
        }
        approved
        suspended
        createdAt
        updatedAt
    }
`;

export const COMPANY_ACCOUNT = `
    ...on CompanyProfile {
        id
        accountId
        name
        nameKana
        roles
        email
        phoneNumber
        emailVerified
        registrationNumber
        profilePhoto {
            ${PROFILE_PHOTO}
        }
        address {
             ${ADDRESS}
        }
        host {
            ${HOST}
        }
        approved
        suspended
        createdAt
        updatedAt
    }
`;

export const RESULT = `
    message
    action
`;

export const IMAGE_UPLOAD_RESULT = `
    type
    mime
    key
    url
`;

export const SPACE_TYPE = `
    id
    title
    description
    available
    photo {
        ${PHOTO}
    }
`;

export const SPACE_PRICE_PLAN = `
    id
    title
    isDefault
    type
    duration
    amount
    maintenanceFee
    lastMinuteDiscount
    cooldownTime
    fromDate
    toDate
    overrides {
        id
        type
        amount
        daysOfWeek
        fromDate
        toDate
    }
`;

export const STATION = `
    id
    stationName
    stationZipCode
    address
    longitude
    latitude
    prefectureCode
`;

export const PAGINATION = `
    paginationInfo{
        hasNext
        hasPrevious
    }
`;

export const SPACE_TYPES = `
    spaceTypes {
        id
        title
        photo {
            ${PHOTO}
        }
    }
`;

export const NEAREST_STATIONS = `
    nearestStations {
        station {
            id
            stationName
        }
        time
        via
        exit
    }
`;

export const SPACE = `
    id
    name
    description
    maximumCapacity
    numberOfSeats
    spaceSize
    needApproval
    published
    ${SPACE_TYPES}
    address {
        ${ADDRESS}
    }
    ${NEAREST_STATIONS}
    
    photos {
        ${PHOTO}
    }
    host {
        accountId
        name
        createdAt
    }
    pricePlans {
        ${SPACE_PRICE_PLAN}
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
    subcriptionPrice
`;

export const SPACE_SETTING = `
    id
    totalStock
    isDefault
    closed
    businessDays
    openingHr
    closingHr
    breakFromHr
    breakToHr
    fromDate
    toDate`;

export const PAYMENT_SOURCE = `
    paymentSource{
        id
        token
        type
        expMonth
        expYear
        last4
        brand
        country
        customer
        isDefault
    }
`;

export const PRICE_SCHEME_OBJECT = `
id
name
roomCharge
oneAdultCharge
twoAdultCharge
threeAdultCharge
fourAdultCharge
fiveAdultCharge
sixAdultCharge
sevenAdultCharge
eightAdultCharge
nineAdultCharge
tenAdultCharge
oneChildCharge
twoChildCharge
threeChildCharge
fourChildCharge
fiveChildCharge
sixChildCharge
sevenChildCharge
eightChildCharge
nineChildCharge
tenChildCharge
hotelId
createdAt
updatedAt
`;

export const PRICE_OVERRIDE_OBJECT = `
id
startDate
endDate
priceScheme {
    ${PRICE_SCHEME_OBJECT}
}
createdAt
updatedAt
`;

export const STOCK_OVERRIDE_OBJECT = `
id
startDate
endDate
stock
createdAt
updatedAt
`;

export const BASIC_PRICE_SETTING_OBJECT = `
id
dayOfWeek
priceScheme{
    ${PRICE_SCHEME_OBJECT}
}
hotelRoomId
createdAt
updatedAt`;

// Todo add packagePlanId in basicPriceSettings later
export const HOTLE_ROOM = `
    id
    name
    description
    paymentTerm
    maxCapacityAdult
    maxCapacityChild
    stock
    hotelId
    photos{
        ${PHOTO}
    }
    basicPriceSettings{
        ${BASIC_PRICE_SETTING_OBJECT}
    }
    createdAt
    updatedAt
`;

export const BASICE_PRICE_SETTINGS = `
    id
    dayOfWeek
    priceScheme{
        ${PRICE_SCHEME_OBJECT}
    }
    hotelRoomId
    createdAt
    updatedAt
`;

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
    createdAt
    updatedAt
`;

export const PACKAGE_ROOM_TYPE_OBJECT = `
id
hotelRoom {
    ${HOTLE_ROOM}
}
priceSettings {
    ${BASIC_PRICE_SETTING_OBJECT}
}
createdAt
updatedAt
`;

export const PLAN_OBJECT = `
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
subcriptionPrice
photos {
    ${PHOTO}
}
roomTypes  {
    ${PACKAGE_ROOM_TYPE_OBJECT}
}
createdAt
updatedAt
`;

export const HOTEL_OBJECT = `
id
name
description
checkInTime
checkOutTime
status
address {
    ${ADDRESS}
}
nearestStations {
    station {
        id
        stationName
    }
    time
    accessType
}
photos {
    ${PHOTO}
}
rooms {
    ${HOTLE_ROOM}
}
packagePlans {
    ${PLAN_OBJECT}
}
createdAt
updatedAt
`;
