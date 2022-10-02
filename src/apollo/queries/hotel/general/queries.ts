import { gql } from "@apollo/client";

import { HOTEL_GENERAL_SCHEME } from "./core.schema";
import {
    ADDRESS,
    PHOTO,
    STATION,
    HOTLE_ROOM,
    PAGINATION,
} from "../../core.queries";

export const MY_HOTELS = gql`
    query MyHotels {
        myHotels {
            data {
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
            ${PAGINATION}
        }
    }
`;

export const HOTEL_BY_ID = gql`
    query HotelById($id:ID!){
        hotelById(id:$id){
              ${HOTEL_GENERAL_SCHEME}
        }
}`;
