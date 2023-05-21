import { gql } from "@apollo/client";
import {
    ADDRESS,
    PHOTO,
    PREFECTURE,
    SPACE_PRICE_PLAN,
    STATION,
    SPACE,
    PAGINATION,
    SPACE_TYPES,
    SPACE_SETTING,
    USER_ACCOUNT,
    COMPANY_ACCOUNT,
    HOTEL_OBJECT,
    PAGINATION_INFO,
    SPACE_LITE,
} from "./core.queries";

export const GET_ALL_SPACE_TYPES = gql`
    query GetAllSpaceTypes {
        allSpaceTypes {
            id
            title
            description
            photo {
                ${PHOTO}
            }
        }
    }
`;

export const GET_AVAILABLE_SPACE_TYPES = gql`
    query GetAvailableSpaceTypes {
        availableSpaceTypes {
            id
            title
            description
            photo {
                ${PHOTO}
            }
        }
    }
`;

export const GET_AVAILABLE_SPACE_TYPES_WITHPHOTO = gql`
    query GetAvailableSpaceTypes {
        availableSpaceTypes {
            id
            title
            description
            photo {
                ${PHOTO}
            }
            available
        }
    }
`;

export const GET_PREFECTURE = gql`
    query Prefectures {
        prefectures {
            ${PREFECTURE}
        }
    }
`;

export const GET_ALL_PREFECTURE = gql`
    query AllPrefectures {
        allPrefectures {
            ${PREFECTURE}
        }
    }
`;

export const GET_LINES_BY_PREFECTURE = gql`
    query LinesByPrefecture($prefectureId: Int!) {
        linesByPrefecture(prefectureId: $prefectureId) {
            id
            name
        }
    }
`;

export const GET_STATIONS_BY_LINE = gql`
    query stationsByLine($lineId: Int!) {
        stationsByLine(lineId: $lineId) {
            id
            stationName
        }
    }
`;

export const ADD_SPACE = gql`
    mutation AddSpace($input: AddSpaceInput!) {
        addSpace(input: $input) {
            space {
                ${SPACE}
            }
            result {
                message
                action
            }
        }
    }
`;

export const UPDATE_SPACE = gql`
    mutation UpdateMySpace($input: UpdateMySpaceInput!) {
        updateMySpace(input: $input) {
            message
            action
        }
    }
`;

export const MY_SPACES = gql`
    query MySpaces(
        $paginate: PaginationOption
    ) {
        mySpaces(paginate:$paginate){
            data {
                id
                name
                maximumCapacity
                numberOfSeats
                spaceSize
                needApproval
                photos {
                    ${PHOTO}
                }
                nearestStations {
                    station {
                        ${STATION}
                    }
                    via
                    time
                }
                spaceTypes {
                    id
                    title
                    description
                    photo {
                        ${PHOTO}
                    }
                }
                address {
                    ${ADDRESS}
                }
                published 
            }
            paginationInfo{
                ${PAGINATION_INFO}
            }
        
        }

    }
`;

export const GET_MY_LICENSE = gql`
    query MyLicense($paginate:PaginationOption){
        getMyLicenses(paginate:$paginate) {
            data{ 
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
            paginationInfo{
                ${PAGINATION_INFO}
            }

        }
    }
`;

// spacePricePlans {
//     ${SPACE_PRICE_PLAN}
// }

export const GET_STATION_BY_ID = gql`
    query StaionByID($id: IntID!){
        stationByID(id: $id){
            ${STATION}
        }
    }
    `;

export const ADD_SPACE_ADDRESS = gql`
    mutation AddSpaceAddress($spaceId: ID!, $address: AddAddressInput!) {
        addSpaceAddress(spaceId: $spaceId, address: $address) {
            address {
                id
            }
            result {
                message
                action
            }
        }
    }
`;

export const UPDATE_SPACE_ADDRESS = gql`
    mutation UpdateSpaceAddress($spaceId: ID!, $address: UpdateAddressInput!) {
        updateSpaceAddress(spaceId: $spaceId, address: $address) {
            message
            action
        }
    }
`;
export const UPDATE_SPACE_SETTING = gql`
    mutation UpdateSpaceSetting($input: UpdateSpaceSettingInput!) {
        updateSpaceSetting(input: $input) {
            result {
                message
                action
            }
        }
    }
`;

export const ADD_DEFAULT_SPACE_PRICE = gql`
    mutation AddDefaultPrice($spaceId: ID!, $input: AddDefaultPriceInput!) {
        addDefaultPrice(spaceId: $spaceId, input: $input) {
            result {
                message
                action
            }
        }
    }
`;

export const UPDATE_DEFAULT_SPACE_PRICE = gql`
    mutation UpdateDefaultPrice(
        $spaceId: ID!
        $input: UpdateDefaultPriceInput!
    ) {
        updateDefaultPrice(spaceId: $spaceId, input: $input) {
            result {
                message
                action
            }
        }
    }
`;

export const UPDATE_TYPES_IN_SPACE = gql`
    mutation UpdateTypesInSpace($input: UpdateTypesInSpaceInput!) {
        updateTypesInSpace(input: $input) {
            message
            action
        }
    }
`;

export const ADD_DEFAULT_SPACE_SETTINGS = gql`
    mutation AddDefaultSpaceSetting(
        $spaceId: ID!
        $spaceSetting: AddDefaultSpaceSettingInput!
    ) {
        addDefaultSpaceSetting(spaceId: $spaceId, spaceSetting: $spaceSetting) {
            result {
                message
                action
            }
            setting {
                ${SPACE_SETTING}
            }
        }
    }
`;

export const ADD_NEAREST_STATION = gql`
    mutation AddNearestStations(
        $spaceId: ID!
        $stations: [AddNearestStationInput]!
    ) {
        addNearestStations(spaceId: $spaceId, stations: $stations) {
            result {
                message
                action
            }
            nearestStations {
                time
            }
        }
    }
`;

export const REMOVE_NEAREST_STATION = gql`
    mutation RemoveNearestStation($input: RemoveNearestStationInput!) {
        removeNearestStation(input: $input) {
            message
            action
        }
    }
`;

export const GET_UPLOAD_TOKEN = gql`
    mutation AddSpacePhotos($spaceId: ID!, $imageInputs: [ImageUploadInput]!) {
        addSpacePhotos(spaceId: $spaceId, imageInputs: $imageInputs) {
            type
            url
            mime
            key
        }
    }
`;

export const REMOVE_SPACE_PHOTO = gql`
    mutation RemoveSpacePhoto($photoId: ID!) {
        removeSpacePhoto(photoId: $photoId) {
            message
        }
    }
`;
export const CHANGE_DEFAULT_SPACE_PHOTO = gql`
    mutation changeDefaultSpacePhoto($photoId: ID!, $spaceId: ID!) {
        changeDefaultSpacePhoto(photoId: $photoId, spaceId: $spaceId) {
            message
        }
    }
`;

export const GET_LICENSE_UPLOAD_TOKEN = gql`
    mutation addLicense($input: AddLicenseInput!) {
        addLicense(input: $input) {
            type
            url
            mime
            key
        }
    }
`;

export const ADD_PRICING_PLAN = gql`
    mutation AddPricePlan(
        $spaceId: ID!
        $pricePlan: AddPricePlanInput!
    ) {
        addPricePlan(spaceId: $spaceId, pricePlan: $pricePlan) {
            result {
                message
                action
            }
            pricePlan {
                ${SPACE_PRICE_PLAN}
            }
        }
    }
`;

export const REMOVE_PRICING_PLAN = gql`
    mutation RemoveSpacePricePlan($id: ID!) {
        removeSpacePricePlan(id: $id) {
            message
            action
        }
    }
`;

export const GET_SPACE_BY_ID = gql`
    query spaceById($id: ID!) {
        spaceById(id: $id) {
            ${SPACE}
            settings {
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
                toDate
            }
        }
    }
`;

export const GET_TOP_PICK_SPACES = gql`
    query top_picks($paginate: PaginationOption){
        availableSpaceTypes {
            id
            title
            description
            photo {
                ${PHOTO}
            }
        }
        allSpaces(paginate: $paginate){
            data {
                ${SPACE_LITE}
            }
            ${PAGINATION} 
        }
        allPublishedHotels {
            ${HOTEL_OBJECT}
        }
    }
`;

export const ADD_SETTING_OVERRIDE = gql`
    mutation OverrideSpaceSetting(
        $spaceId: ID!
        $spaceSetting: OverrideSpaceSettingInput!
    ) {
        overrideSpaceSetting(spaceId: $spaceId, spaceSetting: $spaceSetting) {
            result {
                message
                action
            }
            setting {
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
                toDate
            }
        }
    }
`;

export const ADD_PRICE_OVERRIDE = gql`
    mutation OverrideSpacePriceOverride(
        $pricePlanId: ID!
        $input: PricePlanOverrideInput!
    ) {
        addPricePlanOverride(pricePlanId: $pricePlanId, input: $input) {
            result {
                message
                action
            }
            pricePlanOverride {
                id
                type
                amount
                daysOfWeek
                fromDate
                toDate
            }
        }
    }
`;

export const REMOVE_SPACE_SETTING_OVERRIDE = gql`
    mutation RemoveSpaceSettingOverride($id: ID!) {
        removeSpaceSetting(id: $id) {
            message
            action
        }
    }
`;
export const REMOVE_PRICE_OVERRIDE = gql`
    mutation RemoveSpacePriceOverride($id: ID!) {
        removePricePlanOverride(id: $id) {
            message
            action
        }
    }
`;

export const PUBLISH_SPACE = gql`
    mutation PublishSpace($id: ID!, $publish: Boolean) {
        publishSpace(id: $id, publish: $publish) {
            message
            action
        }
    }
`;

export const UNPUBLISH_SPACE = gql`
    mutation PublishSpace($id: ID!) {
        publishSpace(id: $id) {
            message
            action
        }
    }
`;

export const GET_PRICE_PLANS = gql`
    query getApplicablePricePlans($input: GetApplicablePricePlansInput) {
        getApplicablePricePlans(input: $input) {
            total
            duration
            durationType
            spaceAmount
            optionAmount
            applicablePricePlans {
                id
                title
                duration
                type
                isDefault
                isOverride
                fromDate
                toDate
                amount
                appliedTimes
            }
        }
    }
`;

export const GET_PRICE_PLANS_WITH_AUTH = gql`
    query ApplicablePricePlansWithAuth(
        $input: GetApplicablePricePlansWithAuthInput
    ) {
        getApplicablePricePlansWithAuth(input: $input) {
            total
            duration
            durationType
            spaceAmount
            optionAmount
            applicablePricePlans {
                id
                title
                duration
                type
                isDefault
                isOverride
                fromDate
                toDate
                amount
                appliedTimes
            }
            subscriptionUnit
            subscriptionAmount
        }
    }
`;

export const GET_RESERVATION_BY_ID = gql`
    query reservationById($id: ID!){
        reservationById(id: $id){
            id
            reservationId
            fromDateTime
            toDateTime
            status
            updatedAt
            createdAt
            approved
            approvedOn
            reservee {
                ${USER_ACCOUNT}
                ${COMPANY_ACCOUNT}
            }
            space {
                ${SPACE}
            }
            transaction {
                id
                amount
                currency
                status
                paymentMethodInfo {
                    brand
                    last4
                    country
                    expYear
                    expMonth
                }
            }
        }
    }
`;

export const CANCEL_RESERVATION = gql`
    mutation cancelReservation($input: CancelReservationInput!) {
        cancelReservation(input: $input) {
            message
            action
        }
    }
`;

export const CANCEL_ROOM_RESERVATION = gql`
    mutation CancelRoomReservation($input: CancelRoomReservationInput!) {
        cancelRoomReservation(input: $input) {
            message
            action
        }
    }
`;

export const ADD_REVIEW = gql`
    mutation addReview($input: GiveRatingInput!) {
        giveRating(input: $input) {
            id
            rating
            comment
            spaceId
            byAccountId
            createdAt
            updatedAt
        }
    }
`;

export const RESERVE_SPACE = gql`
    mutation reserveSpace($input: ReserveSpaceInput) {
        transactionId
        intentId
        intentCode
        amount
        description
        currency
        paymentMethodTypes
    }
`;
