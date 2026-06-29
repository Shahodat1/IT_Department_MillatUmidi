import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../services/adminApi";

function CoursesGrid() {
  const BASE_URL = API_BASE;
  const PAGE_SIZE = 8;

  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const [filterTitle, setFilterTitle] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/courses/?page=${currentPage}`);
        const data = await res.json();

        const list = data.results || data;
        console.log(data);

        setCourses(list);
        setFiltered(list);

        const count = typeof data.count === "number" ? data.count : list.length;
        setTotalCount(count);
        setTotalPages(Math.max(1, Math.ceil(count / PAGE_SIZE)));
      } catch (error) {
        console.error("Courses fetch error:", error);
        setCourses([]);
        setFiltered([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    };

    fetchCourses();
  }, [BASE_URL, currentPage]);

  // 🔍 SEARCH (1 ta mos)
  useEffect(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      setFiltered(courses);
      return;
    }

    let found = false;

    const result = courses.filter((c) => {
      const courseName = String(c.name ?? c.title ?? "").toLowerCase();

      if (!found && courseName.includes(query)) {
        found = true;
        return true;
      }
      return false;
    });

    setFiltered(result);
  }, [search, courses]);

  // 🎯 FILTER
  const filterCourse = (type, value) => {
    let result = [];

    if (type === "category") {
      result = courses.filter((c) => c.category_display === value);
    }

    if (type === "course") {
      result = courses.filter((c) => String(c.id) === String(value));
    }

    setFiltered(result);
    setFilterTitle(value);
    setShowDropdown(false);
  };

  const showAll = () => {
    setFiltered(courses);
    setFilterTitle("");
    setShowDropdown(false);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setShowDropdown(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPaginationItems = () => {
    if (totalPages <= 1) return [1];

    const pages = [];
    const delta = 1;

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (left > 2) {
      pages.push("...");
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <>
      {/* 🔥 CONTENT */}
      <div className="bg-white dark:bg-[#091728] text-[#317873]">
        <div className="container-custom">
          <section className="pt-[60px]">
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-full border border-[#B69B83]/25 bg-white/70 px-4 py-2 text-xs sm:text-sm font-medium text-[#7A644F] shadow-sm backdrop-blur dark:bg-white/5 dark:text-[#AAF0D1]">
                Academic Courses
              </div>

              <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#091728] dark:text-[#AAF0D1]">
                Courses
              </h2>

              <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-[#317873] via-[#AAF0D1] to-transparent" />
            </div>

            <div className="flex flex-wrap justify-between gap-4 items-center">
              <div className="flex items-center gap-4 relative flex-wrap ml-auto">
                {/* 🔽 DROPDOWN */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 bg-white dark:bg-[#091728] text-[#317873] border border-[#317873]/30 text-[#1f6f6a] px-5 py-2.5 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200 hover:bg-[#f6fbfa] hover:border-[#317873]/50 hover:shadow-md"
                  >
                    <span className="font-medium">Explore</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        showDropdown ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute top-14 left-0 z-20 w-[540px] rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)] overflow-hidden">
                      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <button
                          type="button"
                          onClick={showAll}
                          className="rounded-full border border-[#317873]/20 bg-[#f4fbfa] px-4 py-2 text-sm font-medium text-[#317873] transition hover:bg-[#e8f6f4]"
                        >
                          Show all
                        </button>
                      </div>

                      <div className="p-5">
                        <div className="mb-4 flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-[#317873]"></span>
                          <p className="text-sm font-medium text-slate-700">
                            Available courses
                          </p>
                        </div>

                        <div className="max-h-[320px] overflow-y-auto pr-1">
                          <div className="grid grid-cols-2 gap-3">
                            {courses.length ? (
                              courses.map((course) => (
                                <button
                                  key={course.id}
                                  type="button"
                                  onClick={() =>
                                    filterCourse("course", course.id)
                                  }
                                  className="group flex min-h-[56px] items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 transition-all duration-200 hover:border-[#317873]/40 hover:bg-[#f4fbfa] hover:shadow-sm"
                                  title={
                                    course.name || course.title || "Course"
                                  }
                                >
                                  <span className="line-clamp-2 group-hover:text-[#317873]">
                                    {course.name || course.title || "Course"}
                                  </span>
                                </button>
                              ))
                            ) : (
                              <p className="col-span-2 text-sm text-slate-500">
                                No courses found
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 🔍 SEARCH */}
                <div className="relative w-[300px]">
                  <input
                    type="text"
                    placeholder="What do you want to learn?"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className=" bg-white dark:bg-[#091728] text-[#317873] w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#317873]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* FILTER TITLE */}
          {filterTitle && (
            <h2 className="text-2xl font-bold text-[#317873] mb-6">
              {filterTitle}
            </h2>
          )}

          {/* 🔥 COURSES GRID */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-3 gap-6 mt-6 py-[60px]">
              {filtered.map((course) => (
                <div
                  key={course.id}
                  className=" bg-white dark:bg-[#091728] text-[#317873] border-2 border-[#317873] rounded-xl bg-white p-3 shadow-md hover:shadow-lg transition"
                >
                  <img
                    src={course.image || "/images/course.jpg"}
                    alt={course.name}
                    className="w-full h-[180px] object-contain bg-gray-100 rounded-md mb-3"
                  />

                  <p className="text-sm text-gray-500">
                    <strong>Code:</strong> {course.code}
                  </p>

                  <p className="text-base font-semibold text-[#317873] mt-1 leading-snug">
                    {course.name}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Credits:</strong> {course.credits} ECTS
                  </p>

                  <p className="text-sm text-gray-600">
                    <strong>Teacher:</strong>{" "}
                    {course.teachers?.[0]?.name || "No teacher"}
                  </p>

                  <Link
                    to={`/course_detail/${course.code}`}
                    className="inline-block mt-3 px-4 py-2 text-sm rounded-full bg-gradient-to-r from-[#317873] to-[#45a088] text-white font-semibold shadow-md hover:brightness-110 transition"
                  >
                    Course details
                  </Link>
                </div>
              ))}
            </div>

            {/* 📄 PAGINATION */}
            <div className="mt-2 flex flex-col items-center gap-4 pb-12">
              <div className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                {getPaginationItems().map((item, index) =>
                  item === "..." ? (
                    <span
                      key={`dots-${index}`}
                      className="px-2 text-slate-500 select-none"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => goToPage(item)}
                      className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                        item === currentPage
                          ? "bg-[#317873] text-white shadow-md"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {item}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>

              <div className="text-xs text-slate-500">
                Total courses: {totalCount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CoursesGrid;
