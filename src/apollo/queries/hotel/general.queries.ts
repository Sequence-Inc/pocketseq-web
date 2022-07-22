import { gql } from "@apollo/client";
import { IMAGE_UPLOAD_RESULT } from "../core.queries";

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
