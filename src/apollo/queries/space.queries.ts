import { gql } from "@apollo/client";

export const GET_ALL_SPACE_TYPES = gql`
    query GetAllSpaceTypes {
        allSpaceTypes {
            id
            title
            description
        }
    }
`;

export const GET_AVAILABLE_SPACE_TYPES = gql`
    query GetAvailableSpaceTypes {
        availableSpaceTypes {
            id
            title
        }
    }
`;

export const GET_AVAILABLE_SPACE_TYPES_WITHPHOTO = gql`
    query GetAvailableSpaceTypes {
        availableSpaceTypes {
            id
            title
            description
            photo
            available
        }
    }
`;

export const GET_PREFECTURE = gql`
    query AllPrefectures {
        allPrefectures {
            id
            name
            nameKana
            nameRomaji
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
            nearestStations {
                station {
                    id
                    stationName
                    stationZipCode
                    address
                    longitude
                    latitude
                }
                via
                time
            }
            spacePricePlans {
                id
                planTitle
                hourlyPrice
                dailyPrice
                maintenanceFee
                lastMinuteDiscount
                cooldownTime
            }
            spaceTypes {
                id
                title
                description
            }
        }
    }
`;
