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
} from "../core.queries";

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

export const UPDATE_HOTEL_SPACE = gql`
    mutation UpdateHotel($input: UpdateHotelInput!) {
        updateHotel(input: $input) {
            message
            hotel {
                id
            }
        }
    }
`;

export const UPDATE_HOTEL_ADDRESS = gql`
    mutation UpdateHotel($input: UpdateAddressInput!) {
        updateHotelAddress(input: $input) {
            message
            address {
                id
            }
        }
    }
`;
export const ADD_HOTEL_NEAREST_STATION = gql`
    mutation AddHotelStation(
        $hotelId: ID!
        $stations: [AddHotelNearestStationInput!]!
    ) {
        addHotelNearestStations(hotelId: $hotelId, stations: $stations) {
            message
            nearestStations {
                time
            }
        }
    }
`;

export const REMOVE_HOTEL_NEAREST_STATION = gql`
    mutation RemoveHotelStation($hotelId: ID!, $stationIds: [IntID]) {
        removeHotelNearestStation(hotelId: $hotelId, stationIds: $stationIds) {
            message
        }
    }
`;

export const REMOVE_HOTEL_PHOTO = gql`
    mutation RemoveHotelPhoto($photoId: ID!) {
        removeHotelPhoto(photoId: $photoId) {
            message
        }
    }
`;

export const ADD_HOTEL_PHOTOS = gql`
    mutation AddHotelPhotos($hotelId:ID!, $photos:[ImageUploadInput!]!){
        addHotelPhotos(hotelId:$hotelId,photos:$photos) { 
            message
            uploadRes{
                ${IMAGE_UPLOAD_RESULT}
            }
        }
    }
`;
