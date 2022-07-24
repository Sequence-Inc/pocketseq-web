import { gql } from "@apollo/client";
import {
    HOTLE_ROOM,
    IMAGE_UPLOAD_RESULT,
    PRICE_OVERRIDE_OBJECT,
    STOCK_OVERRIDE_OBJECT,
    BASIC_PRICE_SETTING_OBJECT,
} from "../../core.queries";

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

export const UPDATE_HOTEL_ROOMS = gql`
    mutation UpdateHotelRoom($input: UpdateHotelRoomInput!) {
        updateHotelRoom(input: $input) {
            message
            hotelRoom {
                id
            }
        }
    }
`;
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

export const UPDATE_HOTEL_ROOMS_PRICE_SETTINGS = gql`
    mutation UpdateHotelRoomPriceSettings(
        $hotelRoomId: ID!
        $priceSettings: [UpdateBasicPriceSettingInput!]!
    ) {
        updateHotelRoomPriceSetting(
            hotelRoomId: $hotelRoomId
            priceSettings: $priceSettings
        ) {
            message
            basicPriceSettings{
                ${BASIC_PRICE_SETTING_OBJECT}
            }
        }
    }
`;

export const ADD_ROOM_PRICE_OVERRIDE = gql`
    mutation AddRoomPriceOverride($hotelRoomId: ID!, $priceOverride: AddPriceOverrideInput!){
        addPriceOverrideInHotelRoom(hotelRoomId:$hotelRoomId, priceOverride: $priceOverride){
            message
            priceOverride {
                ${PRICE_OVERRIDE_OBJECT}
            }
        }
    }
`;

export const ADD_ROOM_STOCK_OVERRIDE = gql`
    mutation AddStockOverrideInHotelRoom($hotelRoomId: ID!, $stockOverride: AddStockOverrideInput!){
        addStockOverrideInHotelRoom(hotelRoomId:$hotelRoomId, stockOverride: $stockOverride){
            message
            stockOverride {
                ${STOCK_OVERRIDE_OBJECT}
            }
        }
    }
`;

export const REMOVE_ROOM_PRICE_OVERRIDE = gql`
    mutation RemoveRoomPriceOverride(
        $hotelRoomId: ID!
        $priceOverrideIds: [ID]!
    ) {
        removePriceOverrideFromHotelRoom(
            hotelRoomId: $hotelRoomId
            priceOverrideIds: $priceOverrideIds
        ) {
            message
            action
        }
    }
`;

export const REMOVE_ROOM_STOCK_OVERRIDE = gql`
    mutation RemoveStockOverrideFromHotelRoom(
        $hotelRoomId: ID!
        $stockOverrideIds: [ID]!
    ) {
        removeStockOverrideFromHotelRoom(
            hotelRoomId: $hotelRoomId
            stockOverrideIds: $stockOverrideIds
        ) {
            message
            action
        }
    }
`;
