import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { Oval } from 'react-loader-spinner';
import MainContainer from '../../components/MainContainer';

export default function Product({ product, colors, catalogPage, language }) {
  const { custom_attributes } = product;
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

  custom_attributes.forEach((item) => {
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

  console.log(product);

  // const { data: colors } = useSWR(
  //   `${process.env.NEXT_PUBLIC_API_URL}/rest/${lang}/V1/products/attributes/color`
  // );
  //console.log('cal -> ', catalogPage[0]);

  //var colorsList = Object.assign({}, colors.options);

  const { data: products } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/rest/${lang}/V1/varsity-products?
  searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B1%5D%5Bfield%5D=visibility&searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B1%5D%5Bvalue%5D=4&
  searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B1%5D%5Bfield%5D=type_id&searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B1%5D%5Bvalue%5D=configurable&searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B1%5D%5Bfield%5D=series&searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B1%5D%5Bvalue%5D=${product.filter_series}`
  );

  const filteredProducts = products
    ? products.items.filter(
        (item) => item.type_id !== 'simple' && item.status !== 2
      )
    : null;

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
                  src={process.env.NEXT_PUBLIC_CATALOG_IMAGE_URL + image.file}
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
            <b>Colors</b>
          </p>
          <div className="flex flex-wrap">
            {!products ? (
              <Oval
                ariaLabel="loading-indicator"
                height={30}
                width={30}
                strokeWidth={5}
                color="red"
                secondaryColor="red"
              />
            ) : (
              filteredProducts.map((color) => {
                let productColor = '';
                let colorCode = '';
                let isCurrent = color.sku == product.sku ? true : false;

                //console.log('isCurrent', isCurrent);

                color.custom_attributes.map((attribute) => {
                  if (attribute.attribute_code === 'color') {
                    productColor = attribute.value;
                  }
                });

                let currentColor = colors.options.find(
                  (c) => c.value == parseInt(productColor)
                );

                colorCode = catalogPage[0].catalog_page_color_values.find(
                  (colorItem) =>
                    colorItem.link_and_lab_label === currentColor.label
                );

                return (
                  <Link key={color.id} href={`/product/${color.sku}`}>
                    <a
                      className={`block w-8 h-8 mr-4 mb-4 indent-36 rounded overflow-hidden outline outline-offset-0 outline-gray-500/[0.3] ${
                        +isCurrent &&
                        'cursor-default pointer-events-none outline-red-500/[0.9]'
                      }`}
                      title={currentColor.label}
                      style={{
                        backgroundColor: colorCode.link_and_lab_url
                          ? colorCode.link_and_lab_url
                          : '#9ACD32',
                      }}
                    >
                      {currentColor.label}
                    </a>
                  </Link>
                );
              })
            )}
          </div>
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
    `${process.env.API_URL}/rest/${lang}/V1/products/${context.params.sku}`
  );
  const product = await response.json();

  const responseColors = await fetch(
    `${process.env.API_URL}/rest/${lang}/V1/products/attributes/color`
  );
  const colors = await responseColors.json();

  const responseCatalogPage = await fetch(
    `${process.env.API_URL}/rest/${lang}/V1/content/catalog_page/entities/catalog-page-content?&selectFields[]=catalog_page_color`
  );
  const catalogPage = await responseCatalogPage.json();

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product,
      colors,
      catalogPage,
      language: context.locale,
    },
  };
}
