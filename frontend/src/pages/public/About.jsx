import AboutHero from '../../components/about/AboutHero.jsx';
import AboutMetrics from '../../components/about/AboutMetrics.jsx';
import AboutStory from '../../components/about/AboutStory.jsx';
import AboutPillars from '../../components/about/AboutPillars.jsx';
import AboutHubs from '../../components/about/AboutHubs.jsx';
import AboutCta from '../../components/about/AboutCta.jsx';

// About ialihub mission, pillars, and regional hubs
export default function About() {
  return (
    <div className="bg-[#FAF9F6] text-zinc-900">
      <AboutHero />
      <AboutMetrics />
      <AboutStory />
      <AboutPillars />
      <AboutHubs />
      <AboutCta />
    </div>
  );
}
