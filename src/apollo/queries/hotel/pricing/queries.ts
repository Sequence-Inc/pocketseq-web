import { gql } from "@apollo/client";
import { PRICE_SCHEME_OBJECT } from "../../core.queries";

export const PRICING_BY_HOTEL_ID = gql`
    query PricingByHotelId($hotelId:ID!){
        myPriceSchemes(hotelId:$hotelId){
            ${PRICE_SCHEME_OBJECT}
        }
    }
`;

export const PRICE_SCHEME_BY_ID = gql`
    query PriceSchemeById($id:ID!){
        priceSchemeById(id:$id){
            ${PRICE_SCHEME_OBJECT}
        }
    }
`;
