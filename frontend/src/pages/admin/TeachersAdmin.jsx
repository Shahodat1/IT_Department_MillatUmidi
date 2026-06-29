import ResourcePage from "../../components/admin/ResourcePage";

export default function TeachersAdmin() {
  const fields = [
    {
      name: "first_name",
      label: "First name",
      type: "text",
      required: true,
      placeholder: "John",
    },
    {
      name: "last_name",
      label: "Last name",
      type: "text",
      required: true,
      placeholder: "Smith",
    },
    {
      name: "position",
      label: "Position",
      type: "text",
      required: true,
      placeholder: "Associate Professor",
    },
    {
      name: "academic_degree",
      label: "Academic Degree",
      type: "select",
      options: [
        { value: "bachelor", label: "Bachelor" },
        { value: "master", label: "Master" },
        { value: "phd", label: "PhD" },
        { value: "dsc", label: "Doctor of Science" },
      ],
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "john.smith@university.edu",
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      placeholder: "+998 90 123 45 67",
    },
    {
      name: "bio",
      label: "Bio",
      type: "textarea",
      fullWidth: true,
      rows: 5,
      placeholder: "Write a professional biography of the teacher...",
    },
    {
      name: "photo",
      label: "Photo",
      type: "file",
      accept: "image/*",
      fullWidth: true,
    },
    {
      name: "skills",
      label: "Skills",
      type: "textarea",
      fullWidth: true,
      rows: 4,
      placeholder:
        "Artificial Intelligence, Python, Machine Learning, Data Science...",
    },
    {
      name: "hobbies",
      label: "Hobbies",
      type: "textarea",
      fullWidth: true,
      rows: 4,
      placeholder: "Reading, Research, Programming, Sports, Traveling...",
    },

    {
      name: "office_hours",
      label: "Office Hours",
      type: "nested_section",
      fullWidth: true,
      itemLabel: "Office Hour",
      helperText: "Add consultation hours for this teacher.",
      fields: [
        {
          name: "day",
          label: "Day",
          type: "select",
          helperText: "Select consultation day",
          options: [
            { value: "monday", label: "Monday" },
            { value: "tuesday", label: "Tuesday" },
            { value: "wednesday", label: "Wednesday" },
            { value: "thursday", label: "Thursday" },
            { value: "friday", label: "Friday" },
            { value: "saturday", label: "Saturday" },
          ],
        },
        {
          name: "start_time",
          label: "Start Time",
          type: "text",
          placeholder: "09:00",
        },
        {
          name: "end_time",
          label: "End Time",
          type: "text",
          placeholder: "11:00",
        },
      ],
    },

    {
      name: "teacher_courses",
      label: "Teacher Courses",
      type: "nested_section",
      fullWidth: true,
      itemLabel: "Teacher Course",
      helperText: "Assign courses to this teacher.",
      fields: [
        {
          name: "course",
          label: "Course",
          type: "select",
          helperText: "Select an existing course",
        },
        {
          name: "year",
          label: "Year",
          type: "number",
          placeholder: "2026",
        },
        {
          name: "role",
          label: "Role",
          type: "select",
          options: [
            {
              value: "lecturer",
              label: "Lecturer",
            },
            {
              value: "assistant",
              label: "Assistant",
            },
          ],
        },
      ],
    },

    {
      name: "educations",
      label: "Educations",
      type: "nested_section",
      fullWidth: true,
      itemLabel: "Education",
      helperText: "Add one or more education records for this teacher.",
      fields: [
        {
          name: "degree",
          label: "Degree",
          type: "select",
          options: [
            { value: "bachelor", label: "Bachelor" },
            { value: "master", label: "Master" },
            { value: "phd", label: "PhD" },
          ],
        },
        {
          name: "field_of_study",
          label: "Field of study",
          type: "text",
          placeholder: "Computer Science",
        },
        {
          name: "institution",
          label: "Institution",
          type: "text",
          placeholder: "Tashkent University of Information Technologies",
        },
        {
          name: "start_year",
          label: "Start year",
          type: "number",
          placeholder: "2018",
        },
        {
          name: "end_year",
          label: "End year",
          type: "number",
          placeholder: "2022",
        },
      ],
    },

    {
      name: "work_experiences",
      label: "Work Experiences",
      type: "nested_section",
      fullWidth: true,
      itemLabel: "Work Experience",
      helperText: "Add work history for this teacher.",
      fields: [
        {
          name: "position",
          label: "Position",
          type: "text",
          placeholder: "Senior Lecturer",
        },
        {
          name: "organization",
          label: "Organization",
          type: "text",
          placeholder: "Millat Umidi University",
        },
        {
          name: "start_year",
          label: "Start year",
          type: "number",
          placeholder: "2020",
        },
        {
          name: "end_year",
          label: "End year",
          type: "number",
          placeholder: "2026",
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          fullWidth: true,
          rows: 4,
          placeholder: "Describe responsibilities and achievements...",
        },
      ],
    },

    {
      name: "researches",
      label: "Researches",
      type: "nested_section",
      fullWidth: true,
      itemLabel: "Research",
      helperText: "Add research projects for this teacher.",
      fields: [
        {
          name: "project_title",
          label: "Project title",
          type: "text",
          placeholder: "AI-Based Smart Goalkeeping Robot",
        },
        {
          name: "image_url",
          label: "Image URL",
          type: "text",
          placeholder: "Optional image URL",
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          fullWidth: true,
          rows: 4,
          placeholder: "Describe the research project...",
        },
        {
          name: "start_year",
          label: "Start year",
          type: "number",
          placeholder: "2024",
        },
        {
          name: "end_year",
          label: "End year",
          type: "number",
          placeholder: "2026",
        },
      ],
    },

    {
      name: "honor_awards",
      label: "Honor Awards",
      type: "nested_section",
      fullWidth: true,
      itemLabel: "Honor Award",
      helperText: "Add awards or honors for this teacher.",
      fields: [
        {
          name: "title",
          label: "Title",
          type: "text",
          placeholder: "Best Researcher Award",
        },
        {
          name: "image_url",
          label: "Image URL",
          type: "text",
          placeholder: "Optional image URL",
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          fullWidth: true,
          rows: 4,
          placeholder: "Describe the award or honor...",
        },
        { name: "year", label: "Year", type: "number", placeholder: "2025" },
      ],
    },

    {
      name: "timetables",
      label: "Timetables",
      type: "nested_section",
      fullWidth: true,
      itemLabel: "Timetable",
      helperText:
        "Add timetable entries for this teacher. Course is selected from existing courses.",
      fields: [
        {
          name: "course",
          label: "Course",
          type: "select",
          helperText: "Choose a course from the list below.",
        },
        {
          name: "day",
          label: "Day",
          type: "select",
          options: [
            { value: "monday", label: "Monday" },
            { value: "tuesday", label: "Tuesday" },
            { value: "wednesday", label: "Wednesday" },
            { value: "thursday", label: "Thursday" },
            { value: "friday", label: "Friday" },
            { value: "saturday", label: "Saturday" },
          ],
        },
        {
          name: "start_time",
          label: "Start time",
          type: "text",
          placeholder: "09:00",
        },
        {
          name: "end_time",
          label: "End time",
          type: "text",
          placeholder: "10:30",
        },
        { name: "room", label: "Room", type: "text", placeholder: "A-203" },
      ],
    },

    {
      name: "attachment",
      label: "Attachment PDF",
      type: "file",
      accept: ".pdf",
      fullWidth: true,
      helperText: "Upload CV, portfolio or other document",
    },
    {
      name: "attachment_url",
      label: "Attachment URL",
      type: "url",
      placeholder: "https://example.com/cv.pdf",
    },
    {
      name: "is_active",
      label: "Active",
      type: "checkbox",
      checkboxLabel: "Teacher is active",
    },
    {
      name: "must_change_password",
      label: "Must change password",
      type: "checkbox",
      checkboxLabel: "Teacher must change password on first login",
    },
  ];

  const columns = [
    {
      key: "photo",
      label: "Photo",
      render: (row) =>
        row.photo ? (
          <img
            src={row.photo}
            alt={row.first_name}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          "-"
        ),
    },
    { key: "first_name", label: "First name" },
    { key: "last_name", label: "Last name" },
    { key: "position", label: "Position" },
    { key: "email", label: "Email" },
    {
      key: "is_active",
      label: "Active",
      render: (row) => (row.is_active ? "Yes" : "No"),
    },
  ];

  return (
    <ResourcePage
      title="Teachers"
      subtitle="Manage teachers"
      endpoint="/api/teachers/"
      resourceName="Teacher"
      fields={fields}
      columns={columns}
      selectOptions={{
        "teacher_courses.course": {
          endpoint: "/api/courses/",
          valueKey: "id",
          labelFn: (item) => {
            const code = item?.code ? `${item.code} - ` : "";
            const name = item?.name || item?.title || `#${item?.id}`;
            return `${code}${name}`;
          },
        },
        "timetables.course": {
          endpoint: "/api/courses/",
          valueKey: "id",
          labelFn: (item) => {
            const code = item?.code ? `${item.code} - ` : "";
            const name = item?.name || item?.title || `#${item?.id}`;
            return `${code}${name}`;
          },
        },
      }}
      defaultValues={{
        first_name: "",
        last_name: "",
        position: "",
        email: "",
        phone: "",
        bio: "",
        photo: null,
        skills: "",
        hobbies: "",
        office_hours: [],
        teacher_courses: [],
        educations: [],
        work_experiences: [],
        researches: [],
        publications: [],
        honor_awards: [],
        timetables: [],
        attachment: null,
        attachment_url: "",
        is_active: true,
        must_change_password: true,
      }}
    />
  );
}
