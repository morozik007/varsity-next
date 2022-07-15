import MainContainer from '../components/MainContainer';
import ProductItem from '../components/Product';

const Catalog = ({ products }) => {
  const { items } = products;

  //console.log(items);

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

  return (
    <MainContainer title={`Catalog`}>
      <div className="mx-auto max-w-[1088px]">
        <ul className="grid grid-cols-3 gap-4">
          {filteredProducts.map((p) => (
            <li
              key={p.id}
              className="text-center border-solid border-2 border-black"
            >
              <ProductItem product={p} />
            </li>
          ))}
        </ul>
      </div>
    </MainContainer>
  );
};

export default Catalog;

export async function getStaticProps(context) {
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
    `${process.env.API_URL}/rest/${lang}/V1/varsity-products?searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B1%5D%5Bfield%5D=visibility&searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B1%5D%5Bvalue%5D=4`
  );
  const products = await response.json();

  if (!products) {
    return {
      notFound: true,
    };
  }

  return {
    props: { products },
  };
}
