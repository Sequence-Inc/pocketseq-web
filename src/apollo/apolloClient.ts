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

// const getNewToken = async () => {
//     const token = await "ss";
//     return token;
// }

// const errorLink = onError(({ graphQLErrors, networkError, forward, operation }) => {
//     if (graphQLErrors)

//         graphQLErrors.forEach(async ({ message, locations, path }) => {
//             if (message === "Token expired") {
//                 const authorization = await getNewToken();
//                 // modify the operation context with a new token
//                 const oldHeaders = operation.getContext().headers;
//                 operation.setContext({
//                     headers: {
//                         ...oldHeaders,
//                         authorization,
//                     },
//                 });
//                 // retry the request, returning the new observable
//                 return forward(operation);
//             }
//             console.log(
//                 `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
//             )
//         }
//         );
//     if (networkError) console.log(`[Network error]: ${networkError}`);
// });

const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL,
    // uri: "http://68ab-2400-1a00-b010-98bf-1951-459d-bee2-1b8c.ngrok.io/dev/graphql",
    // uri: "http://9afc-2400-1a00-b011-c7a0-ba29-de2-4479-b411.ngrok.io/dev/graphql",
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
