import { useRouter } from 'next/router';
import MainContainer from '../components/MainContainer';

const Basic = ({ basicPage }) => {
  const router = useRouter();
  // const Page = basicPages.filter((item) => item.url_key == router.query.basic);
  //console.log(basicPage);

  return (
    <MainContainer title={basicPage.title}>
      <div
        dangerouslySetInnerHTML={{ __html: basicPage.basic_content }}
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

  const Page = basicPages.filter((item) => item.url_key == context.query.basic);

  const basicPage = Object.assign({}, Page[0]);

  if (!basicPage) {
    return {
      notFound: true,
    };
  }

  return {
    props: { basicPage },
  };
}
