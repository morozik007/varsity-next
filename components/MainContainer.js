import Head from 'next/head';
import Footer from './Footer';
import Header from './Header';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrency, fetchCurrency } from '../slices/currencySlice';
import { useEffect } from 'react';

const MainContainer = ({ children, title }) => {
  const currency = useSelector(getCurrency);
  const dispatch = useDispatch();

  const router = useRouter();
  const lang =
    router.locale === 'no'
      ? 'default'
      : router.locale === 'fr'
      ? 'French'
      : router.locale === 'eu'
      ? 'europe'
      : router.locale === 'gb'
      ? 'United_Kingdom'
      : 'international';

  useEffect(() => {
    dispatch(fetchCurrency(lang));
  }, [dispatch]);

  console.log('currency-->', currency.name);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="flex flex-col h-screen justify-between">
        <Header />
        <main className="mb-auto px-5 pt-24 pb-7">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default MainContainer;
