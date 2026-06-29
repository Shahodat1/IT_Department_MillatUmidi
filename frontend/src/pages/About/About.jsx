import BreadcrumbSection from "../../components/BreadcrumbSection";
import HistorySection from "./HistorySection";
import DepartmentHeadSection from "./DepartmentHeadSection";
import MissionSection from "./MissionSection";
import AcademicSection from "./AcademicSection";
function About() {
  return (
    <div>
      <BreadcrumbSection title="About Us" />
      <HistorySection />
      <DepartmentHeadSection />
      <MissionSection />
      <AcademicSection />
    </div>
  );
}

export default About;
