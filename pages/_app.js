import '../styles/styles.css';
import NextNProgress from 'nextjs-progressbar';
import { SWRConfig } from 'swr';
// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  return (
    <>
      <NextNProgress />
      <SWRConfig value={{ fetcher }}>
        <Component {...pageProps} />
      </SWRConfig>
    </>
  );
}
