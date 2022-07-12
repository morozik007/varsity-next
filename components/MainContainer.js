import Head from 'next/head';
import Link from 'next/link';

const MainContainer = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title} - Varsity Next</title>
      </Head>

      <div className="flex flex-col h-screen justify-between">
        <header className="bg-main text-white p-5">
          <Link href={'/'}>
            <a className="mr-4">Home</a>
          </Link>
          <Link href={'/catalog'}>
            <a>Catalog</a>
          </Link>
        </header>
        <main className="mb-auto px-5 py-7">{children}</main>
        <footer className="bg-main text-white p-5">Footer</footer>
      </div>
    </>
  );
};

export default MainContainer;
