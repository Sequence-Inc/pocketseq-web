import { ApolloClient, HttpLink } from "@apollo/client";
import { persistCache, LocalStorageWrapper } from "apollo3-cache-persist";
import { clientTypeDefs, cache } from "./cache";
import getConfig from "next/config";
import { getSession } from "src/utils/auth";

const { publicRunTimeConfig } = getConfig();

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
