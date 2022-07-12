import Link from 'next/link';
import Image from 'next/image';

const Catalog = ({ products }) => {
  const { items } = products;

  items.forEach((item) => {
    item.custom_attributes.forEach((i) => {
      if (i.attribute_code == 'show_only_campaign') {
        item.only_for_campaign = parseInt(i.value);
      }
      if (i.attribute_code == 'image') {
        item.image = i.value;
      }
    });
  });

  // removing only for campaigns items
  const filteredProducts = items.filter(
    (item) => item.only_for_campaign !== 1 && item.status !== 2
  );

  //console.log(filteredProducts);

  return (
    <>
      <div>Catalog</div>
      <div className="mx-auto max-w-[1088px]">
        <ul className="grid grid-cols-3 gap-4">
          {filteredProducts.map((p) => (
            <li
              key={p.id}
              className="text-center border-solid border-2 border-black"
            >
              <Link href={`/product/${p.sku}`}>
                <a>
                  <Image
                    src={
                      'https://magento.varsity.stage.dock.norse.digital/pub/media/catalog/product/' +
                      p.image
                    }
                    alt={p.name}
                    width={268}
                    height={175}
                    layout="responsive"
                    className="cursor-pointer"
                  />
                </a>
              </Link>
              <Link href={`/product/${p.sku}`}>
                <a>{p.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Catalog;

export async function getServerSideProps(context) {
  const lang =
    context.locale === 'no'
      ? 'default'
      : context.locale === 'fr'
      ? 'French'
      : context.locale === 'eu'
      ? 'europe'
      : context.locale === 'gb'
      ? 'United_Kingdom'
      : 'international';

  const response = await fetch(
    `https://magento.varsity.stage.dock.norse.digital/rest/${lang}/V1/products?searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B1%5D%5Bfield%5D=visibility&searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B1%5D%5Bvalue%5D=4`
  );
  const products = await response.json();
  return {
    props: { products },
  };
}
