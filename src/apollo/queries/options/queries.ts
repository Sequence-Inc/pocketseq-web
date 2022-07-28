import { gql } from "@apollo/client";
import { OPTION_OBJECT } from "./core.scheme";

export const MY_OPTIONS = gql`
    query MyOptions($hotelId: ID, $packagePlanId: ID, $spaceId: ID) {
        myOptions(
            hotelId: $hotelId
            packagePlanId: $packagePlanId
            spaceId: $spaceId
        ) {
            id
            name
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
