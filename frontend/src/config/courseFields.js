export const courseFields = [
  {
    name: "code",
    label: "Code",
    type: "text",
    required: true,
    placeholder: "Masalan: AI101",
  },

  {
    name: "name",
    label: "Name",
    type: "text",
    required: true,
    placeholder: "Artificial Intelligence",
  },

  {
    name: "image",
    label: "Image",
    type: "file",
    accept: "image/*",
    fullWidth: true,
  },

  {
    name: "semester",
    label: "Semester",
    type: "select",
    required: true,
  },

  {
    name: "description",
    label: "Description",
    type: "textarea",
    fullWidth: true,
    rows: 5,
    placeholder: "Course haqida umumiy ma'lumot va maqsadlarini yozing...",
  },

  {
    name: "credits",
    label: "Credits",
    type: "number",
    required: true,
    placeholder: "5",
  },

  // HERO

  {
    name: "hero_title",
    label: "Hero Title",
    type: "textarea",
    fullWidth: true,
    placeholder:
      "What is Artificial Intelligence? Definition, Examples, Jobs and More",
  },

  {
    name: "hero_description",
    label: "Hero Description",
    type: "textarea",
    fullWidth: true,
    placeholder:
      "Artificial Intelligence is a modern field that combines computer science, mathematics and real-world applications.",
  },

  // ABOUT

  {
    name: "about_title",
    label: "About Title",
    type: "text",
    placeholder: "About This Program",
  },

  {
    name: "about_description",
    label: "About Description",
    type: "textarea",
    fullWidth: true,
    placeholder:
      "Provide a detailed explanation of the course objectives, content and outcomes.",
  },

  {
    name: "weeks",
    label: "Course Weeks",
    type: "nested_section",
    itemLabel: "Week",
    fullWidth: true,

    fields: [
      {
        name: "id",
        type: "hidden",
      },

      {
        name: "week_number",
        label: "Week Number",
        type: "number",
        placeholder: "1",
      },

      {
        name: "topic",
        label: "Topic",
        type: "text",
        placeholder: "Introduction to Artificial Intelligence",
      },

      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Describe what students will learn during this week.",
      },

      {
        name: "file",
        label: "Lecture File",
        type: "file",
        accept: ".pdf,.doc,.docx",
      },
    ],
  },

  {
    name: "grading_criteria",
    label: "Grading Criteria",
    type: "nested_section",
    itemLabel: "Criterion",
    fullWidth: true,

    fields: [
      {
        name: "id",
        type: "hidden",
      },

      {
        name: "title",
        label: "Criteria Name",
        type: "text",
        placeholder: "Midterm Exam",
      },

      {
        name: "score",
        label: "Score",
        type: "number",
        placeholder: "30",
      },
    ],
  },

  {
    name: "jobs",
    label: "Course Jobs",
    type: "nested_section",
    itemLabel: "Job",
    fullWidth: true,

    fields: [
      {
        name: "title",
        label: "Title",
        type: "text",
        placeholder: "Machine Learning Engineer",
      },

      {
        name: "url",
        label: "URL",
        type: "url",
        placeholder:
          "https://www.glassdoor.com/Job/machine-learning-engineer-jobs",
      },
    ],
  },

  // VIDEO

  {
    name: "video_url",
    label: "Video URL",
    type: "url",
    placeholder: "https://www.youtube.com/watch?v=xxxxxxxx",
  },

  // COURSE RESOURCES

  {
    name: "resources",
    label: "Course Resources",
    type: "nested_section",
    itemLabel: "Resource",
    fullWidth: true,

    fields: [
      {
        name: "title",
        label: "Title",
        type: "text",
        placeholder: "Deep Learning Specialization",
      },

      {
        name: "url",
        label: "URL",
        type: "url",
        placeholder: "https://www.coursera.org/specializations/deep-learning",
      },
    ],
  },

  {
    name: "items",
    label: "Course Items",
    type: "nested_section",
    itemLabel: "item",
    fullWidth: true,

    fields: [
      {
        name: "item_type",
        label: "Type",
        type: "select",

        options: [
          {
            value: "video",
            label: "Video",
          },
          {
            value: "application",
            label: "Application",
          },
          {
            value: "skill",
            label: "Skill",
          },
          {
            value: "practice",
            label: "Practice",
          },
          {
            value: "resource",
            label: "Resource",
          },
        ],
      },

      {
        name: "title",
        label: "Title",
        type: "text",
        placeholder: "TensorFlow",
      },

      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Provide a short description of this item.",
      },

      {
        name: "url",
        label: "URL",
        type: "url",
        placeholder: "https://www.tensorflow.org",
      },
    ],
  },
];
