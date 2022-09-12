import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/svg" href="/logo.png" />

        <link
          rel="preload"
          href="/fonts/londrina-outline-v23-latin-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="crossorigin"
        />
        <link
          rel="preload"
          href="/fonts/inter-v12-latin-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="crossorigin"
        />
        <link
          rel="preload"
          href=" /fonts/inter-v12-latin-500.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="crossorigin"
        />
        <link
          rel="preload"
          href=" /fonts/inter-v12-latin-600.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="crossorigin"
        />
        <link
          rel="preload"
          href=" /fonts/inter-v12-latin-700.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="crossorigin"
        />
        <link
          rel="preload"
          href=" /fonts/inter-v12-latin-800.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="crossorigin"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
