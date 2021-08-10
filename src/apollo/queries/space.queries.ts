import { gql } from '@apollo/client';

export const GET_ALL_SPACE_TYPES = gql`
    query GetAllSpaceTypes{
        allSpaceTypes{
            id
            title
            description
        }
    }
`

export const ADD_SPACE = gql`
    mutation AddSpace($input: AddSpaceInput!){
        addSpace(input: $input){
            message
            action
        }
    }
`