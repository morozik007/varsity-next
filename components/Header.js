import Link from 'next/link';
import { useSelector } from 'react-redux';
import { getCurrency } from '../slices/currencySlice';

const Header = () => {
  const currency = useSelector(getCurrency);

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
        <span>[currency: {currency.name}]</span>
      </div>
    </header>
  );
};

export default Header;
