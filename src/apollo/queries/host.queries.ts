import { gql } from "@apollo/client";

export const HOST = gql`
    query Host {
        host {
            id
            name
            stripeAccountId
            account {
                message
                url
                balance {
                    available {
                        currency
                        amount
                    }
                    pending {
                        currency
                        amount
                    }
                }
            }
        }
    }
`;

export const ADD_PHOTO_ID = gql`
    mutation AddPhotoId($input: ImageUploadInput!) {
        addPhotoId(input: $input) {
            type
            url
            mime
            key
        }
    }
`;
