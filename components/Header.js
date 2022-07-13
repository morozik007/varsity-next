import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-main text-white p-5">
      <Link href={'/'}>
        <a className="mr-4">Home</a>
      </Link>
      <Link href={'/catalog'}>
        <a>Catalog</a>
      </Link>
    </header>
  );
};

export default Header;
