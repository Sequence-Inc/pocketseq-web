import { gql } from "@apollo/client";
import { PRICE_SCHEME_OBJECT } from "../../core.queries";

export const ADD_PRICING_SCHEME = gql`
    mutation AddPricingScheme($hotelId:ID!,$input:AddPriceSchemeInput!){
        addPriceScheme(hotelId:$hotelId,input:$input){
            message
            priceScheme{
                ${PRICE_SCHEME_OBJECT}
            }
        }
    }
`;

export const UPDATE_PRICING_SHCEME = gql`
    mutation UpdatePricingScheme($input: UpdatePriceSchemeInput!) {
        updatePriceScheme(input: $input) {
            message
            priceScheme {
                id
            }
        }
    }
`;
