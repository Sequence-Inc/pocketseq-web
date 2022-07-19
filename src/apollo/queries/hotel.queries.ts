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
        updateHotel(input: $input) {
            message
            address {
                id
            }
        }
    }
`;

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

export const ROOMS_BY_HOTEL_ID = gql`
    query HotelRoomsByHotelId($hotelId:ID!){
        myHotelRooms(hotelId:$hotelId){
            ${HOTLE_ROOM}
        }
    }
`;
export const PRICING_BY_HOTEL_ID = gql`
    query PricingByHotelId($hotelId:ID!){
        myPriceSchemes(hotelId:$hotelId){
            ${PRICE_SCHEME_OBJECT}
        }
    }
`;

export const ADD_PRICING_SCHEME = gql`
    mutation AddPricingScheme($hotelId:ID!,$input:AddPriceSchemeInput!){
        addPriceScheme(hotelId:$hotelId,input:$input){
            message
            priceScheme{
                ${PRICE_SCHEME_OBJECT}
            }
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

export const PLAN_AND_PLAN_OVERRIDE = gql`
    query PlanById($planId:ID!, $hotelId:ID!){
        packagePlanById(id:$planId){
            ${PLAN_OBJECT}
        }
        priceOverridesByRoomPlanId(roomPlanId:$planId){
            ${PRICE_OVERRIDE_OBJECT}
        }
        stockOverridesByPackagePlanId(packagePlanId: $planId){
            ${STOCK_OVERRIDE_OBJECT}
        }
        myPriceSchemes(hotelId:$hotelId){
            ${PRICE_SCHEME_OBJECT}
        }
    }
`;

export const ADD_PLAN_PRICE_OVERRIDE = gql`
    mutation AddPriceOverrideInRoomPlan($roomPlanId: ID!, $priceOverride: AddPriceOverrideInput!){
        addPriceOverrideInRoomPlan(roomPlanId:$roomPlanId, priceOverride: $priceOverride){
            message
            priceOverride {
                ${PRICE_OVERRIDE_OBJECT}
            }
        }
    }
`;

export const REMOVE_PLAN_PRICE_OVERRIDE = gql`
    mutation RemovePriceOverrideFromRoomPlan(
        $roomPlanId: ID!
        $priceOverrideIds: [ID]!
    ) {
        removePriceOverrideFromRoomPlan(
            roomPlanId: $roomPlanId
            priceOverrideIds: $priceOverrideIds
        ) {
            message
            action
        }
    }
`;

export const ADD_PLAN_STOCK_OVERRIDE = gql`
    mutation AddStockOverrideInPackagePlan($packagePlanId: ID!, $stockOverride: AddStockOverrideInput!){
        addStockOverrideInPackagePlan(packagePlanId:$packagePlanId, stockOverride: $stockOverride){
            message
            stockOverride {
                ${STOCK_OVERRIDE_OBJECT}
            }
        }
    }
`;

export const REMOVE_PLAN_STOCK_OVERRIDE = gql`
    mutation RemoveStockOverrideFromPackagePlan(
        $packagePlanId: ID!
        $stockOverrideIds: [ID]!
    ) {
        removeStockOverrideFromPackagePlan(
            packagePlanId: $packagePlanId
            stockOverrideIds: $stockOverrideIds
        ) {
            message
            action
        }
    }
`;

export const ADD_HOTEL_PACKAGE_PLANS = gql`
    mutation AddPackgePlan($hotelId:ID!, $input:AddPackagePlanInput!){
            addPackagePlan(hotelId:$hotelId,input:$input){
                message
                packagePlan{
                   id
                   name
                   description
                   paymentTerm
                   stock
                   startUsage
                   endUsage
                   startReservation
                   endReservation
                   cutOffBeforeDays
                   cutOffTillTime
                   hotelId
                   photos{
                    ${PHOTO}
                   }
                   roomTypes{
                    id
                    hotelRoom{
                        ${HOTLE_ROOM}
                    }
                    priceSettings{
                        id
                        dayOfWeek
                        priceScheme{
                            ${PRICE_SCHEME_OBJECT}
                        }
                        hotelRoomId
                        createdAt
                        updatedAt
                    }

                    createdAt
                    updatedAt
                   }
                   createdAt
                   updatedAt
                }
                uploadRes{
                    ${IMAGE_UPLOAD_RESULT}
                }
            }
    }
`;

export const MY_PACKGAE_PLANS = gql`
    query MyPackagePlans {
        myPackagePlans {
            id
            name
            description
            paymentTerm
            stock
        }
    }
`;
