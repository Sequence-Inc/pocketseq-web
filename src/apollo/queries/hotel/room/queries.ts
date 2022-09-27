import { gql } from "@apollo/client";
import {
    PAGINATION_INFO,
    HOTLE_ROOM,
    PRICE_SCHEME_OBJECT,
    PRICE_OVERRIDE_OBJECT,
    STOCK_OVERRIDE_OBJECT,
} from "../../core.queries";

export const ROOMS_BY_HOTEL_ID = gql`
    query HotelRoomsByHotelId($hotelId:ID!,$paginate:PaginationOption){
        myHotelRooms(hotelId:$hotelId,paginate:$paginate){
            data{
                ${HOTLE_ROOM}
            }
            paginationInfo{
            ${PAGINATION_INFO}
            }
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

export const ROOMS_BY_ID = gql`
    query RoomsById($roomId:ID!){
        hotelRoomById(id:$roomId){
            ${HOTLE_ROOM}
        }
    }
`;
