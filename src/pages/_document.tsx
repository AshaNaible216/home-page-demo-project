import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="description" content="Naible - A private, evolving AI that's 100% yours—trained on your data, serving your needs, and controlled by you alone." />
          <meta property="og:title" content="Naible - Personal Intelligence" />
          <meta property="og:description" content="A private, evolving AI that's 100% yours—trained on your data, serving your needs, and controlled by you alone." />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Naible - Personal Intelligence" />
          <meta name="twitter:description" content="A private, evolving AI that's 100% yours—trained on your data, serving your needs, and controlled by you alone." />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;