import useSWR from 'swr';
import { useRouter } from 'next/router';
import { Oval } from 'react-loader-spinner';

const Footer = () => {
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

  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/rest/${lang}/V1/content/footer/entities/general-footer?selectFields[]=footer_footer_links&selectFields[]=footer_cta_links&selectFields[]=footer_site_list&selectFields[]=footer_navigation`
  );

  var footer = data ? Object.assign({}, data[0]) : null;

  return (
    <footer className="bg-main text-white p-5 flex justify-center items-center">
      {!data ? (
        <Oval
          ariaLabel="loading-indicator"
          height={30}
          width={30}
          strokeWidth={5}
          color="white"
          secondaryColor="white"
        />
      ) : (
        <div
          className="text-center"
          dangerouslySetInnerHTML={{
            __html: footer.footer_copyright_notice,
          }}
        ></div>
      )}
    </footer>
  );
};

export default Footer;
