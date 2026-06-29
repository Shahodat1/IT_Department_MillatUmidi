import ResourcePage from "../../components/admin/ResourcePage";

export default function DepartmentsAdmin() {
  const fields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      placeholder: "Department of Artificial Intelligence",
    },

    {
      name: "description",
      label: "Description",
      type: "textarea",
      fullWidth: true,
      rows: 4,
      placeholder: "Department haqida qisqacha ma'lumot kiriting...",
    },

    {
      name: "about_extra",
      label: "About extra",
      type: "textarea",
      fullWidth: true,
      rows: 4,
      placeholder:
        "Department tarixi, maqsadlari va qo'shimcha ma'lumotlarni kiriting...",
    },

    {
      name: "image",
      label: "Image",
      type: "file",
      accept: "image/*",
      fullWidth: true,
      helperText: "Department uchun asosiy rasmni yuklang (JPG, PNG)",
    },

    {
      name: "history_pdf",
      label: "History PDF",
      type: "file",
      accept: ".pdf,application/pdf",
      fullWidth: true,
      helperText: "Department tarixi haqidagi PDF hujjatni yuklang",
    },

    {
      name: "head",
      label: "Head of department",
      type: "select",
      helperText: "Department rahbarini tanlang",
    },

    {
      name: "monday_friday_hours",
      label: "Mon–Fri hours",
      type: "text",
      placeholder: "09:00 - 18:00",
    },

    {
      name: "saturday_hours",
      label: "Saturday hours",
      type: "text",
      placeholder: "09:00 - 13:00",
    },

    {
      name: "sunday_hours",
      label: "Sunday hours",
      type: "text",
      placeholder: "Closed",
    },

    {
      name: "hours_note",
      label: "Hours note",
      type: "textarea",
      fullWidth: true,
      rows: 3,
      placeholder: "Masalan: Bayram kunlari ish vaqti o'zgarishi mumkin.",
    },
  ];

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (row) =>
        row.image ? (
          <img
            src={row.image}
            alt={row.name}
            className="h-12 w-12 rounded-xl object-cover"
          />
        ) : (
          "-"
        ),
    },
    { key: "name", label: "Name" },
    {
      key: "head",
      label: "Head",
      render: (row) =>
        row.head ? `${row.head.first_name} ${row.head.last_name}` : "-",
    },
    { key: "monday_friday_hours", label: "Mon–Fri" },
    { key: "saturday_hours", label: "Saturday" },
    { key: "sunday_hours", label: "Sunday" },
  ];

  return (
    <ResourcePage
      title="Departments"
      subtitle="Manage departments"
      endpoint="/api/departments/"
      resourceName="Department"
      fields={fields}
      columns={columns}
      selectOptions={{
        head: {
          endpoint: "/api/teachers/",
          labelFn: (item) => `${item.first_name} ${item.last_name}`,
        },
      }}
      defaultValues={{
        name: "",
        description: "",
        about_extra: "",
        image: null,
        history_pdf: null,
        head: "",
        monday_friday_hours: "09:00 AM – 06:00 PM",
        saturday_hours: "10:00 AM – 02:00 PM",
        sunday_hours: "Closed",
        hours_note: "",
      }}
    />
  );
}
