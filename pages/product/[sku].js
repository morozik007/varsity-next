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
    if (item.attribute_code === 'use_care') {
      product.usecare = item.value;
    }
    if (item.attribute_code === 'fabrics_specifications') {
      product.specifications = item.value;
    }
    if (item.attribute_code === 'shipping_returns_payments') {
      product.shipping_returns = item.value;
    }
    if (item.attribute_code === 'size_fit') {
      product.size_fit = item.value;
    }
  });

  //console.log(product);

  // const { data: colors } = useSWR(
  //   `${process.env.NEXT_PUBLIC_API_URL}/rest/${lang}/V1/products/attributes/color`
  // );
  //console.log('cal -> ', catalogPage[0]);

  //var colorsList = Object.assign({}, colors.options);

  const { data: products } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/rest/${lang}/V1/varsity-products?
  searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B1%5D%5Bfield%5D=visibility&searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B1%5D%5Bvalue%5D=4&
  searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B1%5D%5Bfield%5D=type_id&searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B1%5D%5Bvalue%5D=configurable`
  );

  let seriesCaps;
  let relatedCapsList;

  if (products) {
    const filteredProducts = products.items.filter(
      (item) => item.type_id !== 'simple' && item.status !== 2
    );

    filteredProducts.forEach((product) => {
      product.custom_attributes.forEach((item) => {
        if (item.attribute_code == 'series') {
          product.series = parseInt(item.value);
        }
      });
    });

    seriesCaps = filteredProducts.filter(
      (item) => item.series == product.filter_series
    );

    const relatedCaps = product.product_links.filter(
      (item) => item.link_type == 'related'
    );
    const relatedCapsArray = relatedCaps.map((item) => item.linked_product_sku);

    relatedCapsList = relatedCapsArray.map((item) => {
      var relatedCap = filteredProducts.find((cap) => cap.sku == item);
      return relatedCap;
    });
    console.log('relatedCapsList', relatedCapsList);
  }

  //console.log('seriesCaps', seriesCaps);

  return (
    <MainContainer title={product.name}>
      <div className="mx-auto max-w-[1088px] flex flex-wrap">
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
              seriesCaps.map((color) => {
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
          <hr className="my-5" />
          <div dangerouslySetInnerHTML={{ __html: product.usecare }}></div>
          <hr className="my-5" />
          <div
            dangerouslySetInnerHTML={{ __html: product.specifications }}
          ></div>
          <hr className="my-5" />
          <div
            dangerouslySetInnerHTML={{ __html: product.shipping_returns }}
          ></div>
          <hr className="my-5" />
          <div dangerouslySetInnerHTML={{ __html: product.size_fit }}></div>
        </div>
        {!products ||
          (relatedCapsList.length > 0 && (
            <div className="basis-full">
              <hr className="my-5" />
              <h2 className="text-center mb-5 text-lg">Related products</h2>
              <div className="flex flex-row gap-5">
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
                  relatedCapsList.map((cap) => {
                    return (
                      <div key={cap.id} className="basis-1/3 text-center">
                        {cap.name}
                        {cap.media_gallery_entries &&
                          cap.media_gallery_entries.map((image, imageIndex) => {
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

                            return (
                              <Image
                                key={imageIndex}
                                src={
                                  process.env.NEXT_PUBLIC_CATALOG_IMAGE_URL +
                                  image.file
                                }
                                alt={product.name}
                                width={268}
                                height={175}
                                layout="responsive"
                              />
                            );
                          })}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
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
