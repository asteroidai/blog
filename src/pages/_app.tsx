import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Analytics } from "@vercel/analytics/react"

function Blog({ Component, pageProps }: AppProps) {
  return (
    <>
      <Analytics />
      <Component {...pageProps} />
    </>
  );
}

export default Blog
