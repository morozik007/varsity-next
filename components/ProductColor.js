import Link from 'next/link';

const ProductColor = ({ color, product, colors, catalogPage }) => {
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
    (colorItem) => colorItem.link_and_lab_label === currentColor.label
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
};

export default ProductColor;
