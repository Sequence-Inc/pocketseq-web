import { gql } from "@apollo/client";
import { PREFECTURE, STATION } from "./core.queries";

export const GET_PREFECTURES = gql`
    query GetPrefectures {
        availablePrefectures {
           ${PREFECTURE}
        }
    }
`;

export const GET_PREFECTURE_BY_ID = gql`
query GetPrefecturesByID($prefectureId: Int!){
    prefectureById(id:$prefectureId){
    ${PREFECTURE}
    }
    }
`;

export const GET_LINES = gql`
    query GetLines($prefectureId: Int!) {
        linesByPrefecture(prefectureId: $prefectureId) {
            id
            name
            nameKana
            nameOfficial
            colorCode
            longitude
            latitude
            zoom
        }
    }
`;

export const GET_STATIONS = gql`
    query stationsByLine($lineId: Int!) {
        stationsByLine(lineId: $lineId) {
            id
            stationName
            stationZipCode
            address
            longitude
            latitude
        }
    }
`;

export const GET_STATION_BY_ID = gql`
    query stationById($stationId: Int!) {
        stationByID(id: $stationId) {
           ${STATION}
        }
    }
`;
