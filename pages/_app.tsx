import type { AppProps } from 'next/app';
// tailwind css
import 'tailwindcss/tailwind.css';
import 'style/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen w-full">
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
