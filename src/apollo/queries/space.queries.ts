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
                    ${STATION}
                }
                via
                time
            }
            spacePricePlans {
                ${SPACE_PRICE_PLAN}
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
