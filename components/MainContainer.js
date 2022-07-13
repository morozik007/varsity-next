import Head from 'next/head';
import Footer from './Footer';
import Header from './Header';

const MainContainer = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <div className="flex flex-col h-screen justify-between">
        <Header />
        <main className="mb-auto px-5 py-7">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default MainContainer;
