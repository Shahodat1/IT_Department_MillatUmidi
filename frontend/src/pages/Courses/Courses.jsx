import BreadcrumbSection from "../../components/BreadcrumbSection";
import CoursesGrid from "./CoursesGrid";

function Courses() {
  return (
    <div>
      {/* Breadcrumb */}
      <BreadcrumbSection title="Courses" />
      <CoursesGrid />
    </div>
  );
}

export default Courses;
