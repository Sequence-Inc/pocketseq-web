import { gql } from "@apollo/client";
import {
    ADDRESS,
    PHOTO,
    STATION,
    HOTLE_ROOM,
    IMAGE_UPLOAD_RESULT,
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
    mutation AddHotelRoom($hotelId:ID!,  $input: ADDHotelRoomInput!){
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
