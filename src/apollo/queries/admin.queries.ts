import { gql } from "@apollo/client";

export const ACCOUNTS = gql`
    query allAccounts(
        $filters: AccountFilterOptions!
        $paginate: PaginationOption!
    ) {
        allAccounts(filters: $filters, paginate: $paginate) {
            ... on UserProfile {
                id
                firstName
                lastName
                firstNameKana
                lastNameKana
                roles
                email
                profilePhoto {
                    id
                    mime
                    thumbnail {
                        url
                        height
                        width
                    }
                    medium {
                        url
                        height
                        width
                    }
                }
            }
            ... on CompanyProfile {
                id
                name
                nameKana
                roles
                email
            }
        }
    }
`;

export const SPACE_TYPES = gql`
    query spaceTypes {
        allSpaceTypes {
            id
            title
            description
        }
    }
`;
export const PREFECTURES = gql`
    query prefectures {
        allPrefectures {
            id
            name
            nameKana
            nameRomaji
            available
        }
    }
`;

export const PREFECTURE_BY_ID = gql`
    query prefectureById($id: ID!) {
        Prefecture(id: $id) {
            id
            name
            nameKana
            nameRomaji
            available
        }
    }
`;
