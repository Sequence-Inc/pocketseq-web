import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
    mutation RegisterUser($input: RegisterUserInput!) {
        registerUser(input: $input) {
            message
            action
        }
    }
`;

export const BE_A_HOST = gql`
    mutation BeAHost($input: BeAHostInput) {
        beAHost(input: $input) {
            message
            url
        }
    }
`;

export const REGISTER_HOST = gql`
    mutation RegisterHost($input: RegisterHostInput!) {
        registerHost(input: $input) {
            message
            action
        }
    }
`;

export const VERIFY_EMAIL = gql`
    mutation VerifyEmail($input: VerifyEmailInput) {
        verifyEmail(input: $input) {
            message
            action
        }
    }
`;
export const RESEND_VERIFICATION_CODE = gql`
    query ResendVerificationCode($email: String!) {
        resendVerificationCode(email: $email) {
            message
            action
        }
    }
`;

export const VERIFY_RESET_PASSWORD_REQUEST = gql`
    mutation VerifyResetPasswordRequest(
        $input: VerifyResetPasswordRequestInput!
    ) {
        verifyResetPasswordRequest(input: $input) {
            message
            action
        }
    }
`;

export const FORGOT_PASSWORD = gql`
    mutation ForgotPassword($email: String!) {
        forgotPassword(email: $email) {
            message
            action
        }
    }
`;

export const LOGIN = gql`
    mutation Login($input: LoginInput!) {
        login(input: $input) {
            accessToken
            refreshToken
            profile {
                ... on UserProfile {
                    id
                    email
                    firstName
                    lastName
                    firstNameKana
                    lastNameKana
                    phoneNumber
                    roles
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
                }
                ... on CompanyProfile {
                    id
                    email
                    name
                    nameKana
                    phoneNumber
                    registrationNumber
                    roles
                }
            }
        }
    }
`;

export const RESET_PASSWORD = gql`
    mutation ResetPassword($input: ResetPasswordInput!){
        resetPassword(input: $input){
            message
            action
        }
    }
`;


