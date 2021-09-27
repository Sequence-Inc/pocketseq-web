import { ApolloClient, HttpLink } from "@apollo/client";
import { persistCache, LocalStorageWrapper } from "apollo3-cache-persist";
import { clientTypeDefs, cache } from "./cache";
import { getSession } from "src/utils/auth";
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
    console.log("ERRORO_______________")
    if (graphQLErrors)

        graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        );
    if (networkError) console.log(`[Network error]: ${networkError}`);
});

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

const createApolloClient = () => {
    return new ApolloClient({
        ssrMode: typeof window === "undefined",
        link: new HttpLink({
            uri: "https://mdou6ti0t9.execute-api.ap-northeast-1.amazonaws.com/dev/graphql",
            // uri: "http://localhost:3001/dev/graphql",
            headers: {
                Authorization: token,
            },
        }),
        cache,
        typeDefs: clientTypeDefs,
        connectToDevTools: true,
    });
};

export default createApolloClient;
