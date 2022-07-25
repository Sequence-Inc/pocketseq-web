import { gql } from "@apollo/client";
import * as SCHEMA from "./core.schema";

export const MY_CANCEL_POLICIES = gql`
    query MyCancelPolicies{
        myCancelPolicies{
            ${SCHEMA.CANCEL_POLICY}
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
