import { gql } from "@apollo/client";
import { CANCEL_POLICY } from "./core.schema";

export const ADD_CANCEL_POLICIES = gql`
    mutation AddCancelPolicy($input:AddCancelPolicyInput!){
        addCancelPolicy(input:$input){
            message
            cancelPolicy{
                ${CANCEL_POLICY}
                }
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
