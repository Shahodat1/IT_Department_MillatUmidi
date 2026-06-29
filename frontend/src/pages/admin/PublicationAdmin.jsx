import ResourcePage from "../../components/admin/ResourcePage";

export default function PublicationAdmin() {
  const fields = [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
      placeholder: "Artificial Intelligence in Modern Education Systems",
    },

    {
      name: "teacher",
      label: "Teacher",
      type: "select",
      required: true,
      helperText: "Publication muallifi bo'lgan o'qituvchini tanlang",
    },

    {
      name: "journal",
      label: "Journal",
      type: "text",
      required: true,
      placeholder: "International Journal of Artificial Intelligence",
    },

    {
      name: "year",
      label: "Year",
      type: "number",
      required: true,
      placeholder: "2026",
    },

    {
      name: "month",
      label: "Month",
      type: "select",
      options: [
        { value: "january", label: "January" },
        { value: "february", label: "February" },
        { value: "march", label: "March" },
        { value: "april", label: "April" },
        { value: "may", label: "May" },
        { value: "june", label: "June" },
        { value: "july", label: "July" },
        { value: "august", label: "August" },
        { value: "september", label: "September" },
        { value: "october", label: "October" },
        { value: "november", label: "November" },
        { value: "december", label: "December" },
      ],
      helperText: "Publication chop etilgan oyni tanlang",
    },

    {
      name: "description",
      label: "Description",
      type: "textarea",
      fullWidth: true,
      rows: 6,
      placeholder:
        "Publication haqida qisqacha annotatsiya yoki tavsif yozing...",
    },

    {
      name: "image",
      label: "Cover Image",
      type: "file",
      accept: "image/*",
      fullWidth: true,
      helperText: "Publication uchun cover image yuklang (JPG, PNG, WEBP)",
    },

    {
      name: "file",
      label: "PDF File",
      type: "file",
      accept: ".pdf",
      fullWidth: true,
      helperText: "Publication PDF faylini yuklang",
    },

    {
      name: "is_hidden",
      label: "is Hidden",
      type: "checkbox",
      checkboxLabel: "Hide publication",
    },
  ];

  const columns = [
    {
      key: "image",
      label: "Cover",
      render: (row) =>
        row.image_display ? (
          <img
            src={row.image_display}
            alt={row.title}
            className="w-14 h-14 rounded-xl object-cover"
          />
        ) : (
          "-"
        ),
    },

    {
      key: "title",
      label: "Title",
    },

    {
      key: "teacher",
      label: "Teacher",
      render: (row) => row.teacher_name || "-",
    },

    {
      key: "journal",
      label: "Journal",
    },

    {
      key: "year",
      label: "Year",
    },

    {
      key: "is_hidden",
      label: "Status",
      render: (row) => (row.is_hidden ? "Hidden" : "Visible"),
    },
  ];

  return (
    <ResourcePage
      title="Publications"
      subtitle="Manage scientific publications"
      endpoint="/api/publications/"
      resourceName="Publication"
      fields={fields}
      columns={columns}
      selectOptions={{
        teacher: {
          endpoint: "/api/teachers/",
          valueKey: "id",
          labelFn: (item) =>
            `${item.first_name || ""} ${item.last_name || ""}`.trim(),
        },
      }}
      defaultValues={{
        title: "",
        teacher: "",
        journal: "",
        year: new Date().getFullYear(),
        description: "",
        image: null,
        file: null,
        is_hidden: false,
      }}
    />
  );
}
