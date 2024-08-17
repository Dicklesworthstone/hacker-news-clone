import { Html, Head, Main, NextScript } from 'next/document';
import { extractCritical } from '@emotion/server';
import { ServerStyleSheet } from 'styled-components';

export default function Document(props) {
  const { styles } = props;

  return (
    <Html lang="en">
      <Head>
        {/* SEO Metadata */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="A clone of Hacker News built with Next.js, offering the latest posts and discussions." />
        <meta name="keywords" content="Hacker News, Next.js, Clone, Posts, Discussions" />
        <link rel="icon" href="/favicon.ico" />

        {/* Font and Icons */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
        
        {/* Inject critical CSS from Emotion and Styled-Components */}
        {styles}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// Server-side rendering for styled-components and emotion
Document.getInitialProps = async (ctx) => {
  const sheet = new ServerStyleSheet();
  const originalRenderPage = ctx.renderPage;

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) =>
          sheet.collectStyles(<App {...props} />),
      });

    const initialProps = await Document.getInitialProps(ctx);
    const styles = (
      <>
        {initialProps.styles}
        {sheet.getStyleElement()}
        {extractCritical(initialProps.html).css && (
          <style
            data-emotion={`css ${extractCritical(initialProps.html).ids.join(' ')}`}
            dangerouslySetInnerHTML={{ __html: extractCritical(initialProps.html).css }}
          />
        )}
      </>
    );

    return {
      ...initialProps,
      styles,
    };
  } finally {
    sheet.seal();
  }
};
