import { gql } from "@apollo/client";

import { IMAGE_UPLOAD_RESULT } from "../core.queries";

export const REMOVE_HOTEL_ROOM_PHOTO = gql`
    mutation RemoveHotelRoomPhoto($photoId: ID!) {
        removeHotelRoomPhoto(photoId: $photoId) {
            message
        }
    }
`;

export const ADD_HOTEL_ROOM_PHOTOS = gql`
    mutation AddHotelRoomPhotos($hotelRoomId:ID!, $photos:[ImageUploadInput!]!){
        addHotelRoomPhotos(hotelRoomId:$hotelRoomId,photos:$photos) { 
            message
            uploadRes{
                ${IMAGE_UPLOAD_RESULT}
            }
        }
    }
`;
