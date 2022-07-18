import '../styles/styles.css';
import NextNProgress from 'nextjs-progressbar';
import { SWRConfig } from 'swr';
import { store } from '../store';
import { Provider } from 'react-redux';
// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  return (
    <>
      <NextNProgress />
      <SWRConfig value={{ fetcher }}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </SWRConfig>
    </>
  );
}
