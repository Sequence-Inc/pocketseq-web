import { gql } from "@apollo/client";
import { OPTION_OBJECT } from "./core.scheme";
import { PAGINATION_INFO } from "../core.queries";
export const MY_OPTIONS = gql`
    query MyOptions(
        $hotelId: ID
        $packagePlanId: ID
        $spaceId: ID
        $paginate: PaginationOption
    ) {
        myOptions(
            hotelId: $hotelId
            packagePlanId: $packagePlanId
            spaceId: $spaceId
            paginate: $paginate
        ) {
          data{
            id
            name
            createdAt
          }
          paginationInfo{
          ${PAGINATION_INFO}
          }

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
