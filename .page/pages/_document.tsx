import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📋</text></svg>" />
        <meta name="theme-color" content="#0b1120" />
        <meta name="application-name" content="Planning with AI" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
