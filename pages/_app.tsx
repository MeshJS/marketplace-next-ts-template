import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MeshProvider } from "@meshsdk/react";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MeshProvider>
      <Head>
        <title>Marketplace Starter by Mesh SDK</title>
        <meta name="description" content="Marketplace Starter by Mesh SDK" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://meshjs.dev/favicon/favicon-32x32.png" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </MeshProvider>
  );
}
