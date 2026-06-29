import ResourcePage from "../../components/admin/ResourcePage";
import { courseFields } from "../../config/courseFields";

export default function CoursesAdmin() {
  const columns = [
    {
      key: "image",
      label: "Image",

      render: (row) =>
        row.image_url ? (
          <img
            src={row.image_url}
            alt={row.name}
            className="h-12 w-12 rounded-xl object-cover"
          />
        ) : (
          "-"
        ),
    },

    {
      key: "jobs",
      label: "Jobs",
      render: (row) => row.jobs?.length || 0,
    },

    {
      key: "items",
      label: "Items",

      render: (row) => row.items?.length || 0,
    },
    { key: "code", label: "Code" },

    { key: "name", label: "Name" },

    { key: "credits", label: "Credits" },

    {
      key: "resources",
      label: "Resources",

      render: (row) => row.resources?.length || 0,
    },
  ];

  return (
    <ResourcePage
      title="Courses"
      subtitle="Manage courses"
      endpoint="/api/courses/"
      resourceName="Course"
      fields={courseFields}
      columns={columns}
      selectOptions={{
        semester: {
          endpoint: "/api/semesters/",
          labelFn: (item) => `Semester ${item.semester_n}`,
        },
      }}
      defaultValues={{
        code: "",
        name: "",
        image: null,
        link_url: "",
        semester: "",
        description: "",
        credits: "",

        hero_title: "",
        hero_description: "",

        about_title: "",
        about_description: "",
        jobs: [],

        video_url: "",

        resources: [],
        items: [],
        weeks: [],
      }}
    />
  );
}
