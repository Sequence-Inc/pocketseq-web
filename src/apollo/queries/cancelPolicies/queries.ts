import { gql } from "@apollo/client";
import { PAGINATION } from "../core.queries";
import * as SCHEMA from "./core.schema";

export const MY_CANCEL_POLICIES = gql`
    query MyCancelPolicies {
        myCancelPolicies {
            data {
                id
                name
                description
                createdAt
                updatedAt
            }
            ${PAGINATION} 
        }
    }
`;

export const ADD_FORM_QUERIES = gql`
      query Combined {
        mySpaces {
            data {
                ${SCHEMA.FORM_MY_SPACES}
            }
            ${PAGINATION} 
        }
  
   
        myHotels {
            data {
                ${SCHEMA.FORM_MY_HOTELS}
            }
            ${PAGINATION} 
        }
    }
`;

export const MY_SPACES = gql`
    query MySpaces {
        mySpaces {
            data {
                ${SCHEMA.FORM_MY_SPACES}
            }
            ${PAGINATION} 
        }
    }
`;

export const MY_HOTELS = gql`
    query MyHotels {
        myHotels {
            data {
                ${SCHEMA.FORM_MY_HOTELS}
            }
            ${PAGINATION} 
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
