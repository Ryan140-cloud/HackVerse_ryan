import { HeroSearch } from '@/components/sections/hero-search';
import { Stats } from '@/components/sections/stats';
import { LiveHackathons } from '@/components/sections/live-hackathons';
import { TrendingHackathons } from '@/components/sections/trending-hackathons';
import { FeaturedHackathons } from '@/components/sections/featured-hackathons';
import { Categories } from '@/components/sections/categories';
import { Features } from '@/components/sections/features';
import { Testimonials } from '@/components/sections/testimonials';
import { FAQ } from '@/components/sections/faq';
import { CTA } from '@/components/sections/cta';

export default function App() {
  return (
    <div>
      <HeroSearch />
      <Stats />
      <LiveHackathons />
      <TrendingHackathons />
      <Categories />
      <FeaturedHackathons />
      <Features />
      <Testimonials />
      <FAQ />
      <CTA />
    </div>
  );
}
