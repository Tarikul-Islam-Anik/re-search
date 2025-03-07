import { Blog } from './_components/blogs';
import { FAQ } from './_components/faq';
import { Features } from './_components/features';
import { Hero } from './_components/hero';
import { Pricing } from './_components/pricing';
const HomePage = () => {
  return (
    <>
      <Hero />
      <Features />
      <Pricing />
      <Blog />
      <FAQ />
    </>
  );
};

export default HomePage;
