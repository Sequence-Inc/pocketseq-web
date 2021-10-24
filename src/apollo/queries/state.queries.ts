import { gql } from "@apollo/client";

export const GET_SESSION = gql`
    query GetSession {
        isLoggedIn @client
        currentSession @client {
            accessToken
            refreshToken
        }
        profile @client {
                ... on UserProfile {
                    id
                    email
                    firstName
                    lastName
                    firstNameKana
                    lastNameKana
                    phoneNumber
                    address {
                        id
                        addressLine1
                        addressLine2
                        city
                        longitude
                        latitude
                        postalCode
                        prefecture {
                            id
                            name
                            nameKana
                            nameRomaji
                            available
                        }
                    }
                    profilePhoto {
                        id
                        mime
                        type
                        thumbnail {
                            width
                            height
                            url
                        }
                        small {
                            width
                            height
                            url
                        }
                        # medium {
                        #     width
                        #     height
                        #     url
                        # }
                        # large {
                        #     width
                        #     height
                        #     url
                        # }
                    }
                }
                ... on CompanyProfile {
                    id
                    email
                    name
                    nameKana
                    phoneNumber
                    registrationNumber
                }
            }
        }
`;
