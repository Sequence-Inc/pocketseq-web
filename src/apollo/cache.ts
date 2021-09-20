import { InMemoryCache, makeVar, gql } from "@apollo/client";
import { getInitialProfile, getInitialSession, isAuthenticated } from "../utils/auth";
interface IIsLoggedIn {
    session: boolean;
    role: string;
    user: null | any;
}

export interface ILocalState {
    isLoggedIn: IIsLoggedIn;
}

// export const userSession = makeVar<ILocalState>(localStateInitialValue);

export const isLoggedIn = makeVar<boolean>(isAuthenticated());
export const currentSession = makeVar<Record<string, any>>(getInitialSession());
export const profile = makeVar<Record<string, any>>(getInitialProfile());

export const clientTypeDefs = gql`
    type Address {
        id: ID!
        addressLine1: String!
        addressLine2: String!
        city: String!
        longitude: Float
        latitude: Float
        postalCode: String!
        prefecture: Prefecture!
    }
    type Image {
        width: Int
        height: Int
        url: String
    }

    type Photo {
        id: ID!
        mime: String!
        type: ImageType!
        thumbnail: Image
        small: Image
        medium: Image
        large: Image
    }
    enum ProfileType {
        UserProfile
        CompanyProfile
    }

    type UserProfile {
        id: ID!
        email: String
        firstName: String!
        lastName: String!
        firstNameKana: String!
        lastNameKana: String!
        phoneNumber: String
        address: Address
        profilePhoto: Photo
    }

    type CompanyProfile {
        id: ID!
        email: String
        name: String!
        nameKana: String!
        phoneNumber: String
        registrationNumber: String!
        address: Address
        profilePhoto: Photo
    }

    union Profile = UserProfile | CompanyProfile

    type CurrentSession { 
        accessToken: String!
        refreshToken: String! 
    }

    type LoginResult {
        profile: Profile!
        accessToken: String!
        refreshToken: String!
        roles: [String]!
    }
    extend type Query {
        isLoggedIn: Boolean!
        currentSession: CurrentSession!
        profile: Profile!
    }
`;

export const cache: InMemoryCache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                isLoggedIn: {
                    read() {
                        return isLoggedIn();
                    },
                },
                currentSession: {
                    read() {
                        return currentSession();
                    },
                },
                profile: {
                    read() {
                        return profile();
                    },
                },
                launches: {
                    // ...field policy definitions...
                },
            },
        },
    },
});
