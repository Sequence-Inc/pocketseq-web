import type { AppProps } from "next/app";
import Head from "next/head";
// tailwind css
import "@style/globals.css";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "src/apollo/apollo";

function MyApp({ Component, pageProps }: AppProps) {
    const apolloClient = useApollo(pageProps.initialApolloState);

    return (
        <ApolloProvider client={apolloClient}>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
                />

                {`<script async src="https://www.googletagmanager.com/gtag/js?id=G-5WKZPFK2LT"></script>
                <script>
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-5WKZPFK2LT');
                </script>`}
            </Head>
            <Component {...pageProps} />
        </ApolloProvider>
    );
}

export default MyApp;
