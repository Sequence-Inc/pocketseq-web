import type { AppProps } from "next/app";
import Head from "next/head";
// tailwind css
import "@style/globals.css";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "src/apollo/apollo";
import { useRouter } from "next/router";
import Home from ".";
import { isAuthenticated } from "src/utils/auth";
// import { redirect } from "next/dist/next-server/server/api-utils";

function MyApp({ Component, pageProps }: AppProps) {
    const apolloClient = useApollo(pageProps.initialApolloState);
    const role: string = "admin";
    let allowed = true;
    const router = useRouter();
    if (router.pathname.startsWith("/user-host") && !isAuthenticated()) {
        allowed = false;
    }
    // if (router.pathname.startsWith("/host") && role !== "host") {
    //     allowed = false;
    // }
    // if (router.pathname.startsWith("/admin") && role !== "admin") {
    //     allowed = false;
    // }
    const ComponentToRender = allowed ? Component : Home;

    return (
        <ApolloProvider client={apolloClient}>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
                />
            </Head>
            <ComponentToRender {...pageProps} />
        </ApolloProvider>
    );
}

export default MyApp;
