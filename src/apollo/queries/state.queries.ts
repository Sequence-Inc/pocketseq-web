import { gql } from '@apollo/client';

export const GET_SESSION = gql`
    query GetUserSession {
        isLoggedIn @client {
            session
            role
        }
    }
`