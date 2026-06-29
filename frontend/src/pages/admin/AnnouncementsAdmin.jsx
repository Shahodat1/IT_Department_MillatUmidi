import ResourcePage from "../../components/admin/ResourcePage";

export default function AnnouncementsAdmin() {
  const fields = [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
      placeholder: "Artificial Intelligence Workshop 2026",
    },

    {
      name: "short_description",
      label: "Short description",
      type: "textarea",
      fullWidth: true,
      rows: 3,
      placeholder: "Announcement haqida qisqacha ma'lumot kiriting...",
    },

    {
      name: "content",
      label: "Content",
      type: "textarea",
      fullWidth: true,
      rows: 6,
      required: true,
      placeholder:
        "Announcement, event yoki news haqida batafsil ma'lumot yozing...",
    },

    {
      name: "type",
      label: "Type",
      type: "select",
      options: [
        { value: "news", label: "News" },
        { value: "event", label: "Event" },
        { value: "notice", label: "Notice" },
      ],
      required: true,
      helperText: "Announcement turini tanlang",
    },

    {
      name: "start_date",
      label: "Start date",
      type: "date",
      helperText: "Masalan: 2026-06-25",
    },

    {
      name: "end_date",
      label: "End date",
      type: "date",
      helperText: "Masalan: 2026-06-30",
    },

    {
      name: "location",
      label: "Location",
      type: "text",
      placeholder: "Masalan: Tashkent, Millat Umidi University",
    },

    {
      name: "image",
      label: "Image",
      type: "file",
      accept: "image/*",
      fullWidth: true,
      helperText: "Announcement uchun rasm yuklang (JPG, PNG)",
    },

    {
      name: "file",
      label: "File",
      type: "file",
      accept: ".pdf",
      fullWidth: true,
      helperText: "Qo'shimcha PDF fayl yuklang (ixtiyoriy)",
    },

    {
      name: "telegram_link",
      label: "Telegram link",
      type: "url",
      placeholder: "https://t.me/your_channel",
    },

    {
      name: "department",
      label: "Department",
      type: "select",
      helperText: "Announcement tegishli bo'lgan bo'limni tanlang",
    },

    {
      name: "is_active",
      label: "Active",
      type: "checkbox",
      checkboxLabel: "Announcement is active",
    },

    {
      name: "is_featured",
      label: "Featured",
      type: "checkbox",
      checkboxLabel: "Featured announcement",
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
            alt={row.title}
            className="h-12 w-12 rounded-xl object-cover"
          />
        ) : (
          "-"
        ),
    },
    { key: "title", label: "Title" },
    { key: "type", label: "Type" },
    { key: "start_date", label: "Start date" },
    {
      key: "is_active",
      label: "Active",
      render: (row) => (row.is_active ? "Yes" : "No"),
    },
  ];

  return (
    <ResourcePage
      title="Announcements"
      subtitle="Manage announcements"
      endpoint="/api/announcements/"
      resourceName="Announcement"
      fields={fields}
      columns={columns}
      selectOptions={{
        department: {
          endpoint: "/api/departments/",
          labelFn: (item) => item.name,
        },
      }}
      defaultValues={{
        title: "",
        short_description: "",
        content: "",
        type: "news",
        start_date: "",
        end_date: "",
        location: "",
        image: null,
        file: null,
        telegram_link: "",
        department: "",
        is_active: true,
        is_featured: false,
      }}
    />
  );
}
