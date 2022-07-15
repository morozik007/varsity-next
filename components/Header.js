import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-main text-white p-5 fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-[1088px]">
        <Link href={'/'}>
          <a className="mr-4">Home</a>
        </Link>
        <Link href={'/catalog'}>
          <a className="mr-4">Catalog</a>
        </Link>
        <Link href={'/privacy-policy'}>
          <a className="mr-4">Privacy</a>
        </Link>
      </div>
    </header>
  );
};

export default Header;
