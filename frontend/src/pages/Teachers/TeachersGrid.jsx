import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function TeachersGrid() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${BASE_URL}/api/teachers/`);
        const data = await res.json();
        console.log("Teachers API:", data);

        if (!res.ok) {
          throw new Error(
            data?.detail ||
              data?.message ||
              `Request failed with status ${res.status}`,
          );
        }

        const teachersData = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];

        const activeTeachers = teachersData.filter((t) => t.is_active);

        setTeachers(activeTeachers);
      } catch (err) {
        console.error("Teachers fetch error:", err);
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    };

    loadTeachers();
  }, []);

  const getImageUrl = (url) => {
    if (!url) return "/images/person1.png";
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url}`;
  };

  return (
    <section className="relative py-16 sm:py-20 font-poppins">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-slate-50 to-[#EEF5F5] dark:from-[#081120] dark:via-[#0C1730] dark:to-[#091728]" />

      <div className="container-custom px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-full border border-[#B69B83]/25 bg-white/70 px-4 py-2 text-xs sm:text-sm font-medium text-[#7A644F] shadow-sm backdrop-blur dark:bg-white/5 dark:text-[#AAF0D1]">
            Academic Staff
          </div>

          <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#091728] dark:text-[#AAF0D1]">
            Our Teachers
          </h2>

          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-[#317873] via-[#AAF0D1] to-transparent" />
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm sm:text-base text-slate-500 dark:text-slate-300">
            Loading...
          </div>
        ) : teachers.length === 0 ? (
          <div className="py-16 text-center text-sm sm:text-base text-slate-500 dark:text-slate-300">
            No teachers found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="group overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[#1A2644]"
              >
                <div className="p-6 text-center">
                  <div className="relative mx-auto mb-5 h-[240px] w-[240px] sm:h-[250px] sm:w-[250px] overflow-hidden rounded-full border-4 border-white shadow-[0_12px_35px_rgba(15,23,42,0.12)] dark:border-white/10">
                    <img
                      src={getImageUrl(teacher.photo || teacher.photo_url)}
                      alt={teacher.first_name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-[#091728] dark:text-white">
                    {teacher.first_name} {teacher.last_name}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                    {teacher.academic_degree_display && (
                      <span className="rounded-full bg-[#317873]/10 px-3 py-1 text-xs font-semibold text-[#317873]">
                        {teacher.academic_degree_display}
                      </span>
                    )}

                    <span className="text-sm font-medium text-[#317873] dark:text-[#AAF0D1]">
                      {teacher.position}
                    </span>
                  </div>
                  {teacher.courses?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs sm:text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {teacher.courses.map((c) => c.name).join(" · ")}
                      </p>
                    </div>
                  )}

                  {teacher.interest_areas?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs sm:text-sm leading-6 text-slate-600 dark:text-slate-300">
                        <span className="font-semibold text-[#317873] dark:text-[#AAF0D1]">
                          Area of interest:
                        </span>{" "}
                        {teacher.interest_areas
                          .map((area) => area.title)
                          .join(" · ")}
                      </p>
                    </div>
                  )}

                  <Link
                    to={`/teachers/${teacher.id}`}
                    state={{ teacher }}
                    className="mt-6 inline-flex items-center justify-center rounded-full border border-[#317873] px-5 py-2.5 text-sm font-semibold text-[#317873] transition-all duration-300 hover:bg-[#317873] hover:text-white dark:border-[#AAF0D1] dark:text-[#AAF0D1] dark:hover:bg-[#AAF0D1] dark:hover:text-[#081120]"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default TeachersGrid;
