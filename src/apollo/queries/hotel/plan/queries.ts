import { gql } from "@apollo/client";
import { PACKAGE_PLAN } from "./core.schema";
import { PHOTO, PRICE_SCHEME_OBJECT } from "../../core.queries";

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
          ${PACKAGE_PLAN}
        }}`;
