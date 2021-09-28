import { gql } from "@apollo/client";
import {
    ADDRESS,
    PHOTO,
    PREFECTURE,
    SPACE_PRICE_PLAN,
    STATION,
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
            spaceId
            result {
                message
                action
            }
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
            # needApproval
            # nearestStations {
            #     station {
            #         ${STATION}
            #     }
            #     via
            #     time
            # }
            # spacePricePlans {
            #     ${SPACE_PRICE_PLAN}
            # }
            # spaceTypes {
            #     id
            #     title
            #     description
            #     photo {
            #         ${PHOTO}
            #     }
            # }
            # address {
            #     ${ADDRESS}
            # }
        }
    }
`;

export const GET_STATION_BY_ID = gql`
    query staionByID($id: IntID!){
        stationByID(id: $id){
            ${STATION}
        }
    }
    `;


export const ADD_SPACE_ADDRESS = gql`
    mutation AddSpaceAddress($spaceId: ID!
    $address: AddAddressInput!) {
        addSpaceAddress(spaceId: $spaceId, address:$address) {
            message
            action
        }
    }
`;


export const ADD_NEAREST_STATION = gql`
    mutation AddNearestStations($spaceId: ID!
    $stations: [AddNearestStationInput]!) {
        addNearestStations(spaceId: $spaceId, stations:$stations) {
            message
            action
        }
    }
`;

export const GET_UPLOAD_TOKEN = gql`
    mutation AddSpacePhotos($spaceId: ID!
        $imageInputs: [ImageUploadInput]!) {
        addSpacePhotos(spaceId: $spaceId, imageInputs:$imageInputs) {
            type
            url
            mime
            key
        }
    }
`;

export const ADD_PRICING_PLAN = gql`
    mutation AddSpacePricePlans($spaceId: ID!
        $pricePlans: [AddSpacePricePlanInput]!) {
        addSpacePricePlans(spaceId: $spaceId, pricePlans:$pricePlans) {
            message
            action
        }
    }
`;


export const GET_SPACE_BY_ID = gql`
    query spaceById($id: ID!) {
        spaceById(id: $id) {
                id
                name
                maximumCapacity
                numberOfSeats
                spaceSize
                address {
                    postalCode
                    prefecture {
                        name
                    }
                    city
                    addressLine1
                    addressLine2
                    latitude
                    longitude
                }
                nearestStations {
                    station {
                        stationName
                    }
                    time
                    via
                }
                spacePricePlans {
                    title
                    type
                    amount
                }
        }
    }
`;
