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
} from "./core.queries";

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
    query PlanById($roomPlanId:ID!, $packagePlanId: ID! $hotelId:ID!){
        packagePlanById(id: $packagePlanId){
            ${PLAN_OBJECT}
        }
        priceOverridesByRoomPlanId(roomPlanId:$roomPlanId){
            ${PRICE_OVERRIDE_OBJECT}
        }
        stockOverridesByPackagePlanId(packagePlanId: $packagePlanId){
            ${STOCK_OVERRIDE_OBJECT}
        }
        myPriceSchemes(hotelId:$hotelId){
            ${PRICE_SCHEME_OBJECT}
        }
    }
`;

export const PLAN_AND_PLAN_STOCK_OVERRIDE = gql`
    query PlanById($packagePlanId: ID! $hotelId:ID!){
        packagePlanById(id: $packagePlanId){
            ${PLAN_OBJECT}
        }
        stockOverridesByPackagePlanId(packagePlanId: $packagePlanId){
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

export const UPDATE_PACKAGE_PLAN = gql`
    mutation UpdatePackagePlan($input: UpdatePackagePlanInput!) {
        updatePackagePlan(input: $input) {
            message
            packagePlan {
                id
                name
            }
        }
    }
`;

export const UPDATE_ROOM_TYPE_PACKAGE_PLAN = gql`
    mutation UpdateRoomTypePackagePlan(
        $input: UpdateRoomTypeOfPackagePlanInput!
    ) {
        updateRoomTypeOfPackagePlan(input: $input) {
            message
        }
    }
`;

export const MY_PACKGAE_PLANS = gql`
    query MyPackagePlans {
        myPackagePlans {
            ${PACKAGE_PLAN}
        }
    }
`;

export const PACKAGE_PLAN_BY_HOTEL = gql`
    query PackagePlanByHotel($hotelId: ID!) {
        myPackagePlans(hotelId: $hotelId) {
            id
            name
            description
            paymentTerm
            stock
        }
    }
`;

export const PACKAGE_PLAN_BY_ID = gql`
    query PackagePlanById($id: ID!) {
        packagePlanById(id: $id) {
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
            photos{
                    ${PHOTO}
                   }
            roomTypes {
                id
                hotelRoom {
                    id
                    name
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
            }
        }}`;

export const GET_HOTEL_BY_ID = gql`
    query HotelById($id: ID!) {
        hotelById(id: $id){
            ${HOTEL_OBJECT}
        }
    }
`;

export const CALCULATE_ROOM_PLAN_PRICE = gql`
    query CalculateRoomPlanPrice($input: CalculateRoomPlanInput!) {
        calculateRoomPlanPrice(input: $input) {
            totalAmount
            appliedRoomPlanPriceSettings
            appliedRoomPlanPriceOverrides
        }
    }
`;

export const ALL_PUBLISHED_HOTELS = gql`
    query AllPublishedHotels {
        allPublishedHotels {
            ${HOTEL_OBJECT}
        }
    }
`;

export const RESERVE_HOTEL = gql`
    mutation ReserveHotelRoom($input: ReserveHotelRoomInput!) {
        reserveHotelRoom(input: $input) {
            amount
            currency
            description
            intentCode
            intentId
            paymentMethodTypes
            reservationId
            transactionId
        }
    }
`;

export const PUBLISH_HOTEL = gql`
    mutation PublishHotel($id: ID!, $publish: Boolean!) {
        publishHotel(id: $id, publish: $publish) {
            message
            action
        }
    }
`;

export const HOTEL_ROOM_RESERVATION_BY_ID = gql`
    query HotelRoomReservationById($id: ID!) {
        hotelRoomReservationById(id: $id) {
            id
            reservationId
            fromDateTime
            toDateTime
            status
            createdAt
            updatedAt
            approved
            approvedOn
            hotelRoom{
                id
                name
                description
            }
            packagePlan{
                id
                name
                description
            }
            reservee {
                ${USER_ACCOUNT}
                ${COMPANY_ACCOUNT}
            }
            transaction {
                id
                amount
                currency
                status
                paymentMethodInfo {
                    brand
                    last4
                    country
                    expYear
                    expMonth
                }
            }
        }
    }
`;

export const APPROVE_HOTEL_ROOM_RESERVATION = gql`
    mutation ApproveRoomReservation($reservationId: ID!) {
        approveRoomReservation(reservationId: $reservationId) {
            message
            action
        }
    }
`;

export const DENY_HOTEL_ROOM_RESERVATION = gql`
    mutation DenyRoomReservation($reservationId: ID!) {
        denyRoomReservation(reservationId: $reservationId) {
            message
            action
        }
    }
`;
