import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import DepartmentStatistics from "./DepartmentStatistics";
import PublicationSection from "./PublicationSection";
import BreakingNews from "../../components/BreakingNews";
import PartnersSection from "../../components/PartnersSection";
function Home() {
  return (
    <div>
      <HeroSection />

      <DepartmentStatistics />
      <AboutSection />
      <PublicationSection />
      <BreakingNews />
      <PartnersSection />
    </div>
  );
}

export default Home;
