import ResourcePage from "../../components/admin/ResourcePage";

export default function EventsAdmin() {
  const fields = [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
      placeholder: "Artificial Intelligence Workshop 2026",
    },

    {
      name: "speaker",
      label: "Speaker",
      type: "select",
      helperText: "Tizimdagi o'qituvchini yoki spikerni tanlang",
    },

    {
      name: "speaker_name",
      label: "Speaker name",
      type: "text",
      placeholder: "Dr. John Smith",
    },

    {
      name: "description",
      label: "Description",
      type: "textarea",
      fullWidth: true,
      rows: 5,
      placeholder:
        "Event haqida batafsil ma'lumot, maqsadlari va dasturini kiriting...",
    },

    {
      name: "start_date",
      label: "Start date",
      type: "date",
      required: true,
      helperText: "Masalan: 2026-06-25",
    },

    {
      name: "end_date",
      label: "End date",
      type: "date",
      helperText: "Masalan: 2026-06-27",
    },

    {
      name: "start_time",
      label: "Start time",
      type: "time",
      helperText: "Masalan: 09:00",
    },

    {
      name: "location",
      label: "Location",
      type: "text",
      required: true,
      placeholder: "Millat Umidi University, Conference Hall",
    },

    {
      name: "department",
      label: "Department",
      type: "select",
      helperText: "Event tegishli bo'lgan bo'limni tanlang",
    },

    {
      name: "image",
      label: "Image",
      type: "file",
      accept: "image/*",
      fullWidth: true,
      helperText: "Event uchun rasm yoki banner yuklang",
    },

    {
      name: "image_url",
      label: "Image URL",
      type: "url",
      placeholder: "https://example.com/event-image.jpg",
    },

    {
      name: "video_url",
      label: "Video URL",
      type: "url",
      placeholder: "https://www.youtube.com/watch?v=xxxxxxxx",
    },

    {
      name: "registration_url",
      label: "Registration URL",
      type: "url",
      placeholder: "https://forms.google.com/event-registration",
    },

    {
      name: "is_active",
      label: "Active",
      type: "checkbox",
      checkboxLabel: "Event is active",
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
    { key: "start_date", label: "Start date" },
    { key: "location", label: "Location" },
    {
      key: "is_active",
      label: "Active",
      render: (row) => (row.is_active ? "Yes" : "No"),
    },
  ];

  return (
    <ResourcePage
      title="Events"
      subtitle="Manage events"
      endpoint="/api/events/"
      resourceName="Event"
      fields={fields}
      columns={columns}
      selectOptions={{
        speaker: {
          endpoint: "/api/teachers/",
          labelFn: (item) => `${item.first_name} ${item.last_name}`,
        },
        department: {
          endpoint: "/api/departments/",
          labelFn: (item) => item.name,
        },
      }}
      defaultValues={{
        title: "",
        speaker: "",
        speaker_name: "",
        description: "",
        start_date: "",
        end_date: "",
        start_time: "",
        location: "",
        department: "",
        image: null,
        image_url: "",
        video_url: "",
        registration_url: "",
        is_active: true,
      }}
    />
  );
}
