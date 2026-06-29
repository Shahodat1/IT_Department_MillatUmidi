import BreadcrumbSection from "../../components/BreadcrumbSection";
import TeachersGrid from "./TeachersGrid";

function Teachers() {
  return (
    <div>
      {/* Breadcrumb */}
      <BreadcrumbSection title="Our Teachers" />
      <TeachersGrid />
    </div>
  );
}

export default Teachers;
