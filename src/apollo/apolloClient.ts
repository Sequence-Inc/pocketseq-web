import { ApolloClient, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { persistCache, LocalStorageWrapper } from "apollo3-cache-persist";
import { clientTypeDefs, cache } from "./cache";
import { logout } from "src/utils/auth";
import { getSession } from "next-auth/react";
import { onError } from "apollo-link-error";

const errorLink = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
        if (graphQLErrors) {
            graphQLErrors.forEach(({ action }) => {
                if (action === "refresh-token") {
                    logout();
                    // return fromPromise(
                    //     getNewToken()
                    //         .then(({ accessToken, refreshToken }) => {
                    //             // cookies.set('token', refreshToken);
                    //             // accessTokenVAR(accessToken);
                    //             return token;
                    //         })
                    //         .catch(error => {
                    //             console.log(error)
                    //             return;
                    //         })
                    // ).filter(value => Boolean(value))
                    //     .flatMap(() => {
                    //         // retry the request, returning the new observable
                    //         return forward(operation);
                    //     });
                }
            });
        }
    }
);

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
//                 debugger;
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
    // uri: "http://localhost:3001/dev/graphql",
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
        link: from([authLink(token), httpLink]),
        cache,
        typeDefs: clientTypeDefs,
        connectToDevTools: true,
    });
};

export default createApolloClient;
