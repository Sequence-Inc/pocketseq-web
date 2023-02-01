import { gql } from "@apollo/client";
import { SEARCH_AREA_OBJECT } from "./core.queries";

export const GET_SEARCH_AREA = gql`
    query GetSearchArea($type: SearchAreaType!) {
        getSearchArea(type: $type) {
            ${SEARCH_AREA_OBJECT}
        }
    }
`;
