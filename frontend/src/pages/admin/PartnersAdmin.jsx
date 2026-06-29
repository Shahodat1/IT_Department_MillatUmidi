import ResourcePage from "../../components/admin/ResourcePage";

export default function PartnersAdmin() {
  const fields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      placeholder: "Google, Microsoft, Coursera",
    },

    {
      name: "logo",
      label: "Logo",
      type: "file",
      accept: "image/*",
      fullWidth: true,
      required: true,
      helperText: "Partner tashkilotning logotipini yuklang (JPG, PNG, SVG)",
    },

    {
      name: "website",
      label: "Website",
      type: "url",
      placeholder: "https://www.google.com",
    },

    {
      name: "is_active",
      label: "Is Active",
      type: "checkbox",
      checkboxLabel: "Active",
    },
  ];

  const columns = [
    {
      key: "logo",
      label: "Logo",
      render: (row) =>
        row.logo_display ? (
          <img
            src={row.logo_display}
            alt={row.name}
            className="h-12 w-12 rounded-xl object-contain bg-white"
          />
        ) : (
          "-"
        ),
    },
    { key: "name", label: "Name" },
    {
      key: "website",
      label: "Website",
      render: (row) =>
        row.website ? (
          <a
            href={row.website}
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 underline"
          >
            {row.website}
          </a>
        ) : (
          "-"
        ),
    },
    {
      key: "is_active",
      label: "Active",
      render: (row) => (row.is_active ? "Yes" : "No"),
    },
  ];

  return (
    <ResourcePage
      title="Partners"
      subtitle="Manage partner logos and websites"
      endpoint="/api/partners/"
      resourceName="Partner"
      fields={fields}
      columns={columns}
      defaultValues={{
        name: "",
        logo: null,
        website: "",
        is_active: true,
      }}
    />
  );
}
