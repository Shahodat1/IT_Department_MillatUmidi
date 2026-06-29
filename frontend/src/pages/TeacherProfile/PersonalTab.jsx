function PersonalTab({ teacher, interestAreas, workExperiences, timetable }) {
  if (!teacher) {
    return <div>Loading...</div>;
  }

  // 🔵 Skills array

  const skillsList = teacher.skills ? teacher.skills.split(",") : [];

  // 🔵 Hobbies array

  const hobbiesList = teacher.hobbies ? teacher.hobbies.split(",") : [];

  return (
    <div className="pt-6">
      {/* Title */}

      <h3
        className="
          text-2xl
          font-semibold
          text-[#091728]
          mb-8
          border-b
          border-[#B69B83]
          pb-3
          dark:text-white
        "
      >
        Personal Profile
      </h3>

      <div className="space-y-10">
        {/* Biography */}

        {teacher.bio && (
          <div>
            <h5
              className="
                text-lg
                font-semibold
                text-[#B69B83]
                mb-3
              "
            >
              Biography
            </h5>

            <p
              className="
                text-gray-600
                leading-relaxed
                max-w-3xl
              "
            >
              {teacher.bio}
            </p>
          </div>
        )}

        {/* ⭐ Areas of Expertise */}

        {interestAreas?.length > 0 && (
          <div>
            <h5
              className="
                text-lg
                font-semibold
                text-[#B69B83]
                mb-3
              "
            >
              Areas of Expertise
            </h5>

            <div className="flex flex-wrap gap-3">
              {interestAreas.map((area) => (
                <span
                  key={area.id}
                  className="
                    px-4
                    py-2
                    text-sm
                    rounded-full
                    bg-[#B69B83]/10
                    border
                    border-[#B69B83]/40
                    font-medium
                  "
                >
                  {area.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience */}

        {workExperiences?.length > 0 && (
          <div>
            <h5
              className="
                text-lg
                font-semibold
                text-[#B69B83]
                mb-4
              "
            >
              Work Experience
            </h5>

            <ul className="space-y-4">
              {workExperiences.map((work) => (
                <li
                  key={work.id}
                  className="
                    border-l-4
                    border-[#B69B83]
                    pl-4
                  "
                >
                  <p className="font-semibold text-gray-800">{work.position}</p>

                  <p className="text-gray-600 text-sm">{work.institution}</p>

                  <p className="text-gray-500 text-sm">
                    {work.start_year}

                    {" — "}

                    {work.end_year ? work.end_year : "Present"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}

        {skillsList.length > 0 && (
          <div>
            <h5
              className="
                text-lg
                font-semibold
                text-[#B69B83]
                mb-4
              "
            >
              Skills
            </h5>

            <div
              className="
                grid
                sm:grid-cols-2
                lg:grid-cols-3
                gap-y-2
                gap-x-6
                text-sm
              "
            >
              {skillsList.map((skill, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-green-600">✔</span>

                  <span>{skill.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ⭐ PROFESSIONAL HOBBIES DESIGN */}

        {hobbiesList.length > 0 && (
          <div>
            <h5
              className="
                text-lg
                font-semibold
                text-[#B69B83]
                mb-4
              "
            >
              Hobby & Interests
            </h5>

            <div
              className="
                flex
                flex-wrap
                gap-3
                max-w-3xl
              "
            >
              {hobbiesList.map((hobby, i) => (
                <span
                  key={i}
                  className="
                    px-4
                    py-2
                    text-sm
                    rounded-full
                    
                    border
                    border-[#B69B83]/40
                    shadow-sm
                    hover:bg-[#B69B83]/10
                    transition
                  "
                >
                  {hobby.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ⭐ Timetable */}

        {timetable?.length > 0 && (
          <div>
            <h5
              className="
                text-lg
                font-semibold
                text-[#B69B83]
                mb-4
              "
            >
              Timetable
            </h5>

            <div className="overflow-x-auto">
              <table
                className="
                  min-w-full
                  border
                  text-sm
                "
              >
                <thead className="bg-[#B69B83]/20">
                  <tr>
                    <th className="px-4 py-2 border">Course</th>

                    <th className="px-4 py-2 border">Day</th>

                    <th className="px-4 py-2 border">Time</th>

                    <th className="px-4 py-2 border">Room</th>
                  </tr>
                </thead>

                <tbody>
                  {timetable.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 border">
                        {item.course_name || item.course}
                      </td>

                      <td className="px-4 py-2 border">{item.day}</td>

                      <td className="px-4 py-2 border">
                        {item.start_time}
                        {" - "}
                        {item.end_time}
                      </td>

                      <td className="px-4 py-2 border">{item.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonalTab;
