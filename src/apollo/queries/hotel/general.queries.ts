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
    BASIC_PRICE_SETTING_OBJECT,
} from "../core.queries";

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
