import { gql } from "@apollo/client";
import * as SCHEMA from "./core.schema";

export const MY_CANCEL_POLICIES = gql`
    query MyCancelPolicies {
        myCancelPolicies {
            id
            name
            createdAt
            updatedAt
        }
    }
`;

export const ADD_FORM_QUERIES = gql`
      query Combined {
        mySpaces {
           ${SCHEMA.FORM_MY_SPACES}
        }
  
   
        myHotels {
            ${SCHEMA.FORM_MY_HOTELS}
        }
    }
`;

export const MY_SPACES = gql`
    query MySpaces {
        mySpaces {
           ${SCHEMA.FORM_MY_SPACES}
        }
    }
`;

export const MY_HOTELS = gql`
    query MyHotels {
        myHotels {
            ${SCHEMA.FORM_MY_HOTELS}
        }
    }
`;

export const CANCEL_POLICY_BY_ID = gql`
    query CancelPolicyDetail($id:ID!){
        cancelPolicyById(id:$id){
            ${SCHEMA.CANCEL_POLICY}
        }
    }
`;
