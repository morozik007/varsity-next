import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Lazy, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

const ProductItem = ({ product }) => {
  console.log(product);
  return (
    <>
      <Swiper
        modules={[Lazy, Pagination]}
        lazy={true}
        pagination={{
          clickable: true,
        }}
        spaceBetween={0}
        slidesPerView={1}
        className="mySwiper"
      >
        {product.media_gallery_entries ? (
          product.media_gallery_entries.map((image, index) => {
            if (
              image.types.indexOf('feed_image') >= 0 ||
              image.types.indexOf('main_image') >= 0
            ) {
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

            const LCP = index == 0 ? true : false;

            return (
              <SwiperSlide key={index}>
                <Link href={`/product/${product.sku}`}>
                  <a>
                    <Image
                      src={
                        process.env.NEXT_PUBLIC_CATALOG_IMAGE_URL + image.file
                      }
                      alt={product.name}
                      width={268}
                      height={175}
                      layout="responsive"
                      className="cursor-pointer"
                      priority={LCP}
                    />
                  </a>
                </Link>
              </SwiperSlide>
            );
          })
        ) : product.image ? (
          <SwiperSlide>
            <Link href={`/product/${product.sku}`}>
              <a>
                <Image
                  src={
                    process.env.NEXT_PUBLIC_CATALOG_IMAGE_URL + product.image
                  }
                  alt={product.name}
                  width={268}
                  height={175}
                  layout="responsive"
                  className="cursor-pointer"
                />
              </a>
            </Link>
          </SwiperSlide>
        ) : null}
      </Swiper>
      <Link href={`/product/${product.sku}`}>
        <a>{product.name}</a>
      </Link>
    </>
  );
};

export default ProductItem;
