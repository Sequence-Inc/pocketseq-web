import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
    mutation RegisterUser($input: RegisterUserInput!) {
        registerUser(input: $input) {
            message
            action
        }
  }
`

export const REGISTER_HOST = gql`
    mutation RegisterCompany($input: RegisterCompanyInput!) {
      registerCompany(input: $input) {
            message
            action
        }
  }
`

export const VERIFY_EMAIL = gql`
    mutation VerifyEmail($input: VerifyEmailInput) {
        verifyEmail(input: $input) {
            message
            action
        }
  }
`
export const RESEND_VERIFICATION_CODE = gql`
    query ResendVerificationCode($email: String!) {
      resendVerificationCode(email: $email) {
            message
            action
        }
  }
`

export const VERIFY_RESET_PASSWORD_REQUEST = gql`
    mutation VerifyResetPasswordRequest($input: VerifyResetPasswordRequestInput!) {
      verifyResetPasswordRequest(input: $input) {
            message
            action
        }
  }
`

export const FORGOT_PASSWORD = gql`
    mutation ForgotPassword($email: String!) {
      forgotPassword(email: $email) {
            message
            action
        }
  }
`

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
    }
  }
`;