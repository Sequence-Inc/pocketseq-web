import { gql } from "@apollo/client";
import { CANCEL_POLICY } from "./core.schema";

export const MY_CANCEL_POLICIES = gql`
    query MyCancelPolicies{
        myCancelPolicies{
            ${CANCEL_POLICY}
        }
    }
`;
