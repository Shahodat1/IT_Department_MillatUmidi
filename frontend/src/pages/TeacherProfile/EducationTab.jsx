function EducationTab({ educations }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Education Background</h2>

      {educations.length === 0 && (
        <p className="text-gray-500">No education records found.</p>
      )}

      <div className="space-y-6">
        {educations.map((edu) => (
          <div
            key={edu.id}
            className="p-4 rounded-lg border bg-gray-50 dark:bg-[#0B1120]"
          >
            <h3 className="font-semibold text-[#317873]">
              {edu.degree_display} — {edu.field_of_study}
            </h3>

            <p className="text-gray-700 dark:text-white">{edu.institution}</p>

            <p className="text-sm text-gray-500 dark:text-white">
              {edu.start_year} — {edu.end_year || "Present"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EducationTab;
