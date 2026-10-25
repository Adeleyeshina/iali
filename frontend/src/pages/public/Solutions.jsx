import SolutionsHero from '../../components/solutions/SolutionsHero.jsx';
import MatchScoreFeatureSection from '../../components/solutions/MatchScoreFeatureSection.jsx';
import CompletenessFeatureSection from '../../components/solutions/CompletenessFeatureSection.jsx';
import ApplicationTrackerFeatureSection from '../../components/solutions/ApplicationTrackerFeatureSection.jsx';
import SolutionsCta from '../../components/solutions/SolutionsCta.jsx';

// Solutions breakdown page showcasing match score, completeness meter, and live application tracking
export default function Solutions() {
  return (
    <div className="bg-[#FAF9F6] text-zinc-900 pb-20">
      <SolutionsHero />
      <MatchScoreFeatureSection />
      <CompletenessFeatureSection />
      <ApplicationTrackerFeatureSection />
      <SolutionsCta />
    </div>
  );
}
