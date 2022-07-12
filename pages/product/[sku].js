import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import MainContainer from '../../components/MainContainer';

export default function Product({ product, products, language }) {
  product.custom_attributes.forEach((item) => {
    if (item.attribute_code == 'image') {
      product.image = item.value;
    }
    if (item.attribute_code == 'short_description') {
      product.short_description = item.value;
    }
    if (item.attribute_code == 'description_new') {
      product.description_new = item.value;
    }
    if (item.attribute_code == 'product_type_catalog') {
      product.type = parseInt(item.value);
    }
    if (item.attribute_code == 'show_only_campaign') {
      product.only_for_campaign = parseInt(item.value);
    }
    if (item.attribute_code == 'collect_filter') {
      product.filter_collection = parseInt(item.value);
    }
    if (item.attribute_code == 'series') {
      product.filter_series = parseInt(item.value);
    }
  });

  const filteredProducts = products.items.filter(
    (item) => item.type_id !== 'simple' && item.status !== 2
  );

  //console.log(filteredProducts);

  return (
    <MainContainer title={product.name}>
      <div className="mx-auto max-w-[1088px] flex flex-row">
        <div className="basis-2/3 pr-10">
          {product.media_gallery_entries &&
            product.media_gallery_entries.map((image, imageIndex) => {
              if (image.types.indexOf('feed_image') >= 0) {
                return null;
              }
              if (
                image.types.indexOf('gallery_image_1') >= 0 ||
                image.types.indexOf('gallery_image_2') >= 0 ||
                image.types.indexOf('gallery_image_3') >= 0 ||
                image.types.indexOf('gallery_image_4') >= 0
              ) {
                return null;
              }

              const LCP = imageIndex == 0 ? true : false;

              return (
                <Image
                  key={imageIndex}
                  src={
                    'https://magento.varsity.stage.dock.norse.digital/pub/media/catalog/product/' +
                    image.file
                  }
                  alt={product.name}
                  width={268}
                  height={175}
                  layout="responsive"
                  priority={LCP}
                />
              );
            })}
        </div>
        <div className="basis-1/3">
          <h1 className="text-3xl mb-5 text-main">{product.name}</h1>
          <div
            dangerouslySetInnerHTML={{ __html: product.short_description }}
          ></div>
          <div
            dangerouslySetInnerHTML={{ __html: product.description_new }}
          ></div>
          <hr className="my-5" />
          <p className="mb-2">
            <b>Colors</b> serie: {product.filter_series}
          </p>
          {filteredProducts.map((color) => (
            <Link key={color.id} href={`/product/${color.sku}`}>
              <a className="block mb-1 underline">{color.name}</a>
            </Link>
          ))}
        </div>
      </div>
    </MainContainer>
  );
}

export async function getServerSideProps(context) {
  //console.log(params);
  //console.log(context);

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
    `https://magento.varsity.stage.dock.norse.digital/rest/${lang}/V1/products/${context.params.sku}`
  );
  const product = await response.json();

  const responseProducts = await fetch(
    `https://magento.varsity.stage.dock.norse.digital/rest/V1/products?searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B1%5D%5Bfield%5D=visibility&searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B1%5D%5Bvalue%5D=4&searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B1%5D%5Bfield%5D=type_id&searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B1%5D%5Bvalue%5D=configurable&searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B1%5D%5Bfield%5D=series&searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B1%5D%5Bvalue%5D=303`
  );
  const products = await responseProducts.json();

  return {
    props: {
      product: product,
      products: products,
      language: context.locale,
    },
  };
}
