import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { userSession } from "./cache";
import getConfig from "next/config";
import { getSession } from "src/utils/auth";

const { publicRunTimeConfig } = getConfig();

const createApolloClient = () => {
    return new ApolloClient({
        ssrMode: typeof window === "undefined",
        link: new HttpLink({
            uri: "https://mdou6ti0t9.execute-api.ap-northeast-1.amazonaws.com/dev/graphql",
            // uri: "http://localhost:3001/dev/graphql",
            headers: {
                Authorization: getSession()?.accessToken
                    ? `Bearer ${getSession()?.accessToken}`
                    : "",
            }
        }),
        cache: new InMemoryCache({
            typePolicies: {
                // Type policy map
                Query: {
                    fields: {
                        // Field policy map for the Product type
                        isLoggedIn: {
                            // Field policy for the isInCart field
                            read() {
                                // The read function for the isInCart field
                                return userSession();
                            },
                        },
                    },
                },
            },
        }),
    });
};

export default createApolloClient;
