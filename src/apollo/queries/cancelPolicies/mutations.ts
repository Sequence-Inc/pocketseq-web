import { gql } from "@apollo/client";
import { CANCEL_POLICY } from "./core.schema";

export const ADD_CANCEL_POLICIES = gql`
    mutation AddCancelPolicy($spaceId:ID,$hotelId:ID,$input:[AddCancelPoliciesInput!]!){
        addCancelPolicies(spaceId: $spaceId, hotelId: $hotelId,input: $input){
            ${CANCEL_POLICY}
        }
    }
`;

export const REMOVE_CANCEL_POLICIES = gql`
    mutation RemoveCancelPolicy($id: ID) {
        removeCancelPolicy(id: $id) {
            message
            action
        }
    }
`;

export const UPDATE_CANCEL_POLICIES = gql`
    mutation UpdateCancelPolicy($input:UpdateCancelPolicyInput!){
        updateCancelPolicy(input: $input){
            ${CANCEL_POLICY}
        }
    }
`;
