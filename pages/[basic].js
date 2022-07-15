import { useRouter } from 'next/router';
import MainContainer from '../components/MainContainer';

const Basic = ({ basicPages }) => {
  console.log(basicPages);
  const router = useRouter();
  const Page = basicPages.filter((item) => item.url_key == router.query.basic);

  return (
    <MainContainer title={Page[0].title}>
      <div
        dangerouslySetInnerHTML={{ __html: Page[0].basic_content }}
        className="basic-page mx-auto max-w-[1088px]"
      ></div>
    </MainContainer>
  );
};

export default Basic;

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
    `${process.env.API_URL}/rest/${lang}/V1/content/basic_page/entities/`
  );
  const basicPages = await response.json();

  if (!basicPages) {
    return {
      notFound: true,
    };
  }

  return {
    props: { basicPages },
  };
}
