import type { AppProps } from "next/app";
// tailwind css
import "@style/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default MyApp;
