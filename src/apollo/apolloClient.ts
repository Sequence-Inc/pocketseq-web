import { ApolloClient, HttpLink } from "@apollo/client";
import { persistCache, LocalStorageWrapper } from "apollo3-cache-persist";
import { clientTypeDefs, cache } from "./cache";
import { getSession, logout } from "src/utils/auth";
import { onError } from 'apollo-link-error';
// import { fromPromise } from 'apollo-link';

// const getNewToken = async () => {
//     return await { accessToken: "gg", refreshToken: "gg" }
// }

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
            }
            )
        }
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

const token = getSession()?.accessToken
    ? `Bearer ${getSession()?.accessToken}`
    : "";

// await before instantiating ApolloClient, else queries might run before the cache is persisted
if (typeof window !== "undefined") {
    await persistCache({
        cache,
        storage: new LocalStorageWrapper(window.localStorage),
    });
}

const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL,
    // uri: "http://localhost:3001/dev/graphql",
    headers: {
        Authorization: token,
    },
})

const createApolloClient = () => {
    return new ApolloClient({
        ssrMode: typeof window === "undefined",
        link: errorLink.concat(httpLink),
        cache,
        typeDefs: clientTypeDefs,
        connectToDevTools: true,
    });
};

export default createApolloClient;
