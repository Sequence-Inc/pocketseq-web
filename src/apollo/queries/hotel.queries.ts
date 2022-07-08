import { gql } from "@apollo/client";
import {
    ADDRESS,
    PHOTO,
    STATION,
    HOTLE_ROOM,
    IMAGE_UPLOAD_RESULT,
    PRICE_SCHEME_OBJECT,
} from "./core.queries";

export const ADD_HOTEL_SPACE = gql`
    mutation AddHotel($input: AddHotelInput!) {
        addHotel(input: $input) {
            message
            hotel {
                id
                name
                description
            }
            uploadRes {
                type
                url
                mime
                key
            }
        }
    }
`;

export const ADD_HOTEL_ROOMS = gql`
    mutation AddHotelRoom($hotelId:ID!,  $input: AddHotelRoomInput!){
        addHotelRoom(hotelId:$hotelId, input:$input){
            message
            hotelRoom{
                ${HOTLE_ROOM}
            }
            uploadRes{
                ${IMAGE_UPLOAD_RESULT}
            }
     }
    }
`;

export const MY_HOTELS = gql`
    query MyHotels {
        myHotels {
            id
            name
            description
            checkInTime
            checkOutTime
            status
            address {
                ${ADDRESS}
            }
            nearestStations {
                station {
                    ${STATION}
                }
                accessType
                time
            }  
            photos {
                ${PHOTO}
            }
            rooms{
                ${HOTLE_ROOM}
            }
            createdAt
            updatedAt
        }
    }
`;

export const ROOMS_BY_HOTEL_ID = gql`
    query HotelRoomsByHotelId($hotelId:ID!){
        myHotelRooms(hotelId:$hotelId){
            ${HOTLE_ROOM}
        }
    }
`;
export const PRICING_BY_HOTEL_ID = gql`
    query PricingByHotelId($hotelId:ID!){
        myPriceSchemes(hotelId:$hotelId){
            ${PRICE_SCHEME_OBJECT}
        }
    }
`;

export const ADD_PRICING_SCHEME = gql`
    mutation AddPricingScheme($hotelId:ID,$input:AddPriceSchemeInput!){
        addPriceScheme(hotelId:$hotelId,input:$input){
            message
            priceSchema{
                ${PRICE_SCHEME_OBJECT}
            }
        }
    }
`;
