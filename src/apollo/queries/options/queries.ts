import { gql } from "@apollo/client";
import { PAGINATION } from "../core.queries";
import { OPTION_OBJECT } from "./core.scheme";

export const MY_OPTIONS = gql`
    query MyOptions($hotelId: ID, $packagePlanId: ID, $spaceId: ID) {
        myOptions(
            hotelId: $hotelId
            packagePlanId: $packagePlanId
            spaceId: $spaceId
        ) {
            data {
                 ${OPTION_OBJECT}
            }
            ${PAGINATION}
        }
    }
`;

export const OPTION_BY_ID = gql`
  query OptionById($id:ID!){
    optionById(id:$id){
      ${OPTION_OBJECT}
    }
  }
`;
