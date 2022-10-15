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
                   subcriptionPrice

                }
                uploadRes{
                    ${IMAGE_UPLOAD_RESULT}
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

export const REMOVE_PAKCAGE_PLAN_PHOTO = gql`
    mutation RemovePackagePlanPhoto($photoId: ID!) {
        removePackagePlanPhoto(photoId: $photoId) {
            message
        }
    }
`;

export const ADD_PACKAGE_PLAN_PHOTOS = gql`
    mutation AddPackagePlanPhotos($packagePlanId:ID!, $photos:[ImageUploadInput!]!){
        addPackagePlanPhotos(packagePlanId:$packagePlanId,photos:$photos) { 
            message
            uploadRes{
                ${IMAGE_UPLOAD_RESULT}
            }
        }
    }
`;
