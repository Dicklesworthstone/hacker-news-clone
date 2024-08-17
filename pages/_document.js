import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Essential meta tags and links */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// Try commenting out the custom getInitialProps logic if it's causing issues
Document.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;

  // Attempt without any styled-components or emotion logic first
  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
  };
};
