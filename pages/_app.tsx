import { useEffect } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

import "antd/dist/antd.css";
// tailwind css
import "@style/globals.css";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "src/apollo/apollo";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@hooks/useToasts";

function TimeBook({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) {
    const apolloClient = useApollo(pageProps.initialApolloState);

    const router = useRouter();

    const handleRouteChange = (url) => {
        window.gtag("config", "GTM-577T655", {
            page_path: url,
        });
    };

    useEffect(() => {
        router.events.on("routeChangeComplete", handleRouteChange);
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, [router.events]);

    return (
        <SessionProvider session={session}>
            <ApolloProvider client={apolloClient}>
                <Head>
                    <meta
                        name="viewport"
                        content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
                    />
                </Head>
                <ToastProvider>
                    <Component {...pageProps} />
                </ToastProvider>
            </ApolloProvider>
        </SessionProvider>
    );
}

export default TimeBook;
