import { ApolloClient, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { clientTypeDefs, cache } from "./cache";
import { getSession } from "next-auth/react";
import { onError } from "apollo-link-error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        );

    if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL,
});

const authLink = (token: string = undefined) => {
    return setContext(async (_, { headers }: { headers: Headers }) => {
        let accessToken = "Bearer ";
        if (token) {
            accessToken += token;
        } else {
            const session = await getSession();
            if (session && session.accessToken) {
                accessToken += session.accessToken;
            } else {
                accessToken = "";
            }
        }

        const modifiedHeader = {
            headers: {
                ...headers,
                authorization: accessToken,
            },
        };
        return modifiedHeader;
    });
};

const createApolloClient = (token: string = undefined) => {
    return new ApolloClient({
        ssrMode: typeof window === "undefined",
        link: from([errorLink, authLink(token), httpLink]),
        cache,
        typeDefs: clientTypeDefs,
        connectToDevTools: true,
    });
};

export default createApolloClient;
