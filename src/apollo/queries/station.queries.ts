import { gql } from "@apollo/client";

export const GET_PREFECTURES = gql`
    query GetPrefectures {
        prefectures {
            id
            name
            nameKana
            nameRomaji
            available
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
