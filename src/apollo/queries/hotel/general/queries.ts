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

export const HOTEL_BY_ID = gql`
    query HotelById($id:ID!){
        hotelById(id:$id){
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
}`;
