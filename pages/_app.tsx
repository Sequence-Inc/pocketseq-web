import type { AppProps } from "next/app";
import Head from "next/head";

import "antd/dist/antd.css";
// tailwind css
import "@style/globals.css";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "src/apollo/apollo";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@hooks/useToasts";
import Script from "next/script";
import { ConfigProvider } from "antd";
import jaJP from "antd/lib/locale/ja_JP";
import "dayjs/locale/ja";

function TimeBook({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) {
    const apolloClient = useApollo(pageProps.initialApolloState);

    // const router = useRouter();

    // // handle route changes to send data to GTM
    // const handleRouteChange = (url) => {
    //     window.gtag("config", "GTM-577T655", {
    //         page_path: url,
    //     });
    // };

    // useEffect(() => {
    //     router.events.on("routeChangeComplete", handleRouteChange);
    //     return () => {
    //         router.events.off("routeChangeComplete", handleRouteChange);
    //     };
    // }, [router.events]);

    return (
        <SessionProvider session={session}>
            <ApolloProvider client={apolloClient}>
                <Head>
                    <meta
                        name="viewport"
                        content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
                    />
                </Head>
                <Script id="google-tag-manager" strategy="afterInteractive">
                    {`
                        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','GTM-577T655');
                    `}
                </Script>
                <ToastProvider>
                    <ConfigProvider locale={jaJP}>
                        <Component {...pageProps} />
                    </ConfigProvider>
                </ToastProvider>
            </ApolloProvider>
        </SessionProvider>
    );
}

export default TimeBook;
