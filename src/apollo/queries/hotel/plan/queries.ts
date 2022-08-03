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

            optionsAttachments{
                id
                name
            }
        }}`;
