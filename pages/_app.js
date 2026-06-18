import "../styles/globals.css";
import Head from "next/head";
import Script from "next/script";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#09090f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Red Flag" />
        <meta name="google-site-verification" content="p5h6HBJQhMyuOJtC-khMRAFJdJRZwu9bXGKnW_Aei4s" />
        <link rel="icon" href="/api/icon?size=512" />
        <link rel="apple-touch-icon" href="/api/icon?size=512" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-F4Y5BTNDG0" strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-F4Y5BTNDG0');
      `}</Script>
      <Component {...pageProps} />
    </>
  );
}