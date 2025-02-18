import Document, { Html, Head, Main, NextScript } from "next/document";
import { DocumentContext, DocumentInitialProps } from "next/dist/shared/lib/utils";

const MyDocument = (props: DocumentInitialProps) => {
    return (
        <Html lang="en">
            <Head>
                {/* Poppins Font */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
};

MyDocument.getInitialProps = async (ctx: DocumentContext): Promise<DocumentInitialProps> => {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
};

export default MyDocument;
