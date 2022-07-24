import { gql } from "@apollo/client";
import {
    ADDRESS,
    PHOTO,
    STATION,
    HOTLE_ROOM,
    IMAGE_UPLOAD_RESULT,
    PRICE_SCHEME_OBJECT,
    PRICE_OVERRIDE_OBJECT,
    STOCK_OVERRIDE_OBJECT,
    PLAN_OBJECT,
    PACKAGE_PLAN,
    HOTEL_OBJECT,
    USER_ACCOUNT,
    COMPANY_ACCOUNT,
    BASIC_PRICE_SETTING_OBJECT,
} from "../../core.queries";

export const ROOMS_BY_HOTEL_ID = gql`
    query HotelRoomsByHotelId($hotelId:ID!){
        myHotelRooms(hotelId:$hotelId){
            ${HOTLE_ROOM}
        }
    }
`;

export const GET_ROOM_PRICE_OVERRIDE = gql`
    query PriceOverridesByHotelRoomId($roomId:ID!){
        priceOverridesByHotelRoomId(hotelRoomId:$roomId){
            ${PRICE_OVERRIDE_OBJECT}
        }
    }
`;

export const ROOM_AND_ROOM_OVERRIDE = gql`
    query RoomsById($roomId:ID!, $hotelId:ID!){
        hotelRoomById(id:$roomId){
            ${HOTLE_ROOM}
        }
        priceOverridesByHotelRoomId(hotelRoomId:$roomId){
            ${PRICE_OVERRIDE_OBJECT}
        }
        stockOverridesByHotelRoomId(hotelRoomId: $roomId){
            ${STOCK_OVERRIDE_OBJECT}
        }
        myPriceSchemes(hotelId:$hotelId){
            ${PRICE_SCHEME_OBJECT}
        }
    }
`;
