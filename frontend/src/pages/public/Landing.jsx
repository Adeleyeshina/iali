import HeroSection from '../../components/landing/HeroSection.jsx';
import TrustedMarquee from '../../components/landing/TrustedMarquee.jsx';
import FeaturesSection from '../../components/landing/FeaturesSection.jsx';
import EmployerSection from '../../components/landing/EmployerSection.jsx';
import TestimonialsSection from '../../components/landing/TestimonialsSection.jsx';
import FaqSection from '../../components/landing/FaqSection.jsx';
import CtaSection from '../../components/landing/CtaSection.jsx';

export default function Landing() {
  return (
    <div className="bg-[#FAF9F6] text-zinc-900 overflow-hidden">
      <HeroSection />
      <TrustedMarquee />
      <FeaturesSection />
      <EmployerSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}
