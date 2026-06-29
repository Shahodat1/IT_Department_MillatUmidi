import ResourcePage from "../../components/admin/ResourcePage";

export default function StudentsAdmin() {
  const fields = [
    {
      name: "first_name",
      label: "First name",
      type: "text",
      required: true,
      placeholder: "Shakhodat",
    },

    {
      name: "last_name",
      label: "Last name",
      type: "text",
      required: true,
      placeholder: "Abdunabiyeva",
    },

    {
      name: "group",
      label: "Group",
      type: "text",
      required: true,
      placeholder: "SE-402",
    },

    {
      name: "enrollment_year",
      label: "Enrollment year",
      type: "number",
      required: true,
      placeholder: "2023",
      helperText: "Talaba universitetga qabul qilingan yilni kiriting",
    },
  ];

  const columns = [
    { key: "first_name", label: "First name" },
    { key: "last_name", label: "Last name" },
    { key: "group", label: "Group" },
    { key: "enrollment_year", label: "Enrollment year" },
  ];

  return (
    <ResourcePage
      title="Students"
      subtitle="Manage students for adding certificates belong to students"
      endpoint="/api/students/"
      resourceName="Student"
      fields={fields}
      columns={columns}
      defaultValues={{
        first_name: "",
        last_name: "",
        group: "",
        enrollment_year: "",
      }}
    />
  );
}
