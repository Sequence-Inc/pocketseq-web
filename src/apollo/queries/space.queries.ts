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
                id
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
    query MySpaces {
        mySpaces {
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

export const ADD_PRICING_PLAN = gql`
    mutation AddSpacePricePlans(
        $spaceId: ID!
        $pricePlans: [AddSpacePricePlanInput]!
    ) {
        addSpacePricePlans(spaceId: $spaceId, pricePlans: $pricePlans) {
            result {
                message
                action
            }
            spacePricePlans {
                id
            }
        }
    }
`;

export const REMOVE_PRICING_PLAN = gql`
    mutation RemoveSpacePricePlan($input: RemoveSpacePricePlanInput!) {
        removeSpacePricePlan(input: $input) {
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
            pricePlans {
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
            }
        }
    }
`;

export const GET_TOP_PICK_SPACES = gql`
    query top_picks($paginate: PaginationOption){
        allSpaces(paginate: $paginate){
            data {
                ${SPACE}
            }
            ${PAGINATION} 
        }
    }
`;

// export const DELETE_PRICE_PLAN = gql`
//     mutation deletePricePlan()
// `;
