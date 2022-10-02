import { gql } from "@apollo/client";
import { PACKAGE_PLAN } from "./core.schema";
import { PAGINATION_INFO } from "../../core.queries";

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
            data {
                id
                name
                description
                paymentTerm
                stock
            }
            paginationInfo {
                ${PAGINATION_INFO}
            }
        }
    }
`;

export const PACKAGE_PLAN_BY_ID = gql`
    query PackagePlanById($id: ID!) {
        packagePlanById(id: $id) {
          ${PACKAGE_PLAN}
        }}`;
