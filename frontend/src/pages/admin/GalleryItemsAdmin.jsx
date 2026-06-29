import ResourcePage from "../../components/admin/ResourcePage";

const sectionOptions = [
  { value: "video", label: "Video Gallery" },
  { value: "photo", label: "Photo Gallery" },
  { value: "media", label: "Media Gallery" },
];

const monthOptions = [
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
];

export default function GalleryItemsAdmin() {
  const fields = [
    {
      name: "section",
      label: "Section",
      type: "select",
      options: sectionOptions,
      required: true,
      helperText: "Gallery bo'limini tanlang",
    },
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
      placeholder: "Artificial Intelligence Workshop 2026",
    },

    {
      name: "caption",
      label: "Caption",
      type: "textarea",
      fullWidth: true,
      rows: 4,
      placeholder: "Rasm yoki video haqida qisqacha tavsif yozing...",
    },

    {
      name: "teacher",
      label: "Teacher",
      type: "select",
      required: false,
      helperText: "Agar media ma'lum bir o'qituvchiga tegishli bo'lsa tanlang",
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
      options: monthOptions,
      required: true,
      helperText: "Media joylashtirilgan oyni tanlang",
    },

    {
      name: "image",
      label: "Image",
      type: "file",
      accept: "image/*",
      fullWidth: true,
      helperText: "Rasm yuklang (JPG, PNG, WEBP)",
    },

    {
      name: "video_url",
      label: "Video URL",
      type: "url",
      fullWidth: true,
      placeholder: "https://www.youtube.com/watch?v=xxxxxxxx",
    },

    {
      name: "is_active",
      label: "Is Active",
      type: "checkbox",
      checkboxLabel: "Active",
    },

    {
      name: "order",
      label: "Order",
      type: "number",
      required: true,
      placeholder: "1",
      helperText: "Kichik raqamlar avval ko'rsatiladi (1, 2, 3...)",
    },
  ];
  const columns = [
    {
      key: "image",
      label: "Image",
      render: (row) =>
        row.image_display ? (
          <img
            src={row.image_display}
            alt={row.title}
            className="h-12 w-12 rounded-xl object-cover"
          />
        ) : row.video_embed_url ? (
          <a
            href={row.video_url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            Video
          </a>
        ) : (
          "-"
        ),
    },
    { key: "title", label: "Title" },
    {
      key: "section",
      label: "Section",
      render: (row) => row.section_display || row.section,
    },
    {
      key: "teacher",
      label: "Teacher",
      render: (row) => row.teacher_name || "-",
    },
    {
      key: "month",
      label: "Month",
      render: (row) => row.month_display || row.month,
    },
    { key: "year", label: "Year" },
    {
      key: "is_active",
      label: "Active",
      render: (row) => (row.is_active ? "Yes" : "No"),
    },
  ];

  return (
    <ResourcePage
      title="GalleryItems"
      subtitle="Manage video, photo, and media gallery items"
      endpoint="/api/gallery-items/"
      resourceName=""
      fields={fields}
      columns={columns}
      selectOptions={{
        teacher: {
          endpoint: "/api/teachers/",
          valueKey: "id",
          labelFn: (item) =>
            `${item.first_name || ""} ${item.last_name || ""}`.trim() ||
            item.username ||
            `Teacher #${item.id}`,
        },
      }}
      defaultValues={{
        section: "video",
        title: "",
        caption: "",
        teacher: "",
        year: new Date().getFullYear(),
        month: "june",
        image: null,
        video_url: "",
        is_active: true,
        order: 0,
      }}
    />
  );
}
