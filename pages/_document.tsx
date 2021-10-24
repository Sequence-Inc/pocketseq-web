import Document, {
    Html,
    Head,
    Main,
    NextScript,
    DocumentContext,
} from "next/document";

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html lang="jp">
                <Head>
                    <meta charSet="utf-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="description" content="Description" />
                    <meta name="keywords" content="Keywords" />
                    <link rel="manifest" href="/manifest.json" />
                    <link
                        href="/icons/icon-16x16.png"
                        rel="icon"
                        type="image/png"
                        sizes="16x16"
                    />
                    <link
                        href="/icons/icon-32x32.png"
                        rel="icon"
                        type="image/png"
                        sizes="32x32"
                    />
                    <link rel="apple-touch-icon" href="/apple-icon.png"></link>
                    <meta name="theme-color" content="#317EFB" />

                    <script
                        async
                        src="https://www.googletagmanager.com/gtag/js?id=G-5WKZPFK2LT"
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-5WKZPFK2LT', { page_path: window.location.pathname });
                            `,
                        }}
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                    <div id="modal"></div>
                </body>
            </Html>
        );
    }
}

export default MyDocument;
