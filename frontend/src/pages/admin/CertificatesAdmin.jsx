import ResourcePage from "../../components/admin/ResourcePage";

export default function CertificatesAdmin() {
  const fields = [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
      placeholder: "Certificate of Achievement",
    },

    {
      name: "issuer",
      label: "Issuer",
      type: "text",
      required: true,
      placeholder: "Coursera, Google, Microsoft, Millat Umidi University",
    },

    {
      name: "date_issued",
      label: "Date Issued",
      type: "date",
      required: true,
      helperText: "Masalan: 2026-06-25",
    },

    {
      name: "file",
      label: "PDF File",
      type: "file",
      accept: ".pdf",
      fullWidth: true,
      helperText: "Certificate PDF faylini yuklang",
    },

    {
      name: "image",
      label: "Image",
      type: "file",
      accept: "image/*",
      fullWidth: true,
      helperText: "Certificate rasmi yoki preview rasmini yuklang",
    },

    {
      name: "recipients",
      label: "Certificate Recipients",
      type: "nested_section",
      itemLabel: "Recipient",
      fullWidth: true,

      fields: [
        {
          name: "teacher",
          label: "Teacher",
          type: "select",
          helperText: "Agar certificate o'qituvchiga tegishli bo'lsa tanlang",
        },

        {
          name: "student",
          label: "Student",
          type: "select",
          helperText: "Agar certificate talabaga tegishli bo'lsa tanlang",
        },

        {
          name: "department",
          label: "Department",
          type: "select",
          helperText: "Certificate tegishli bo'lgan bo'limni tanlang",
        },
      ],
    },
  ];

  const columns = [
    {
      key: "image",
      label: "Image",

      render: (row) =>
        row.image_url ? (
          <img
            src={row.image_url}
            alt={row.title}
            className="h-12 w-12 rounded-xl object-cover"
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
      key: "issuer",
      label: "Issuer",
    },

    {
      key: "date_issued",
      label: "Date Issued",
    },

    {
      key: "recipients",
      label: "Recipients",

      render: (row) => {
        if (!row.recipients?.length) return "-";

        return row.recipients.map((r) => (
          <div key={r.id}>
            {r.recipient_type}: {r.recipient_name}
          </div>
        ));
      },
    },
  ];

  return (
    <ResourcePage
      title="Certificates"
      subtitle="Manage certificates"
      endpoint="/api/certificates/"
      resourceName="Certificate"
      fields={fields}
      columns={columns}
      selectOptions={{
        "recipients.teacher": {
          endpoint: "/api/teachers/",
          labelFn: (item) => `${item.first_name} ${item.last_name}`,
        },

        "recipients.student": {
          endpoint: "/api/students/",
          labelFn: (item) => `${item.first_name} ${item.last_name}`,
        },

        "recipients.department": {
          endpoint: "/api/departments/",
          labelFn: (item) => item.name,
        },
      }}
      defaultValues={{
        title: "",
        issuer: "",
        date_issued: "",
        file: null,
        image: null,

        recipients: [],
      }}
    />
  );
}
