import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ResearchCard from "../components/ResearchCard";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function ResearchPage() {
  const [researches, setResearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [search, setSearch] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  useEffect(() => {
    fetchResearches();
  }, []);

  const fetchResearches = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/research/`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setResearches(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Failed to fetch researches:", error);
    } finally {
      setLoading(false);
    }
  };

  const teachers = useMemo(() => {
    const unique = new Map();

    researches.forEach((item) => {
      if (item.teacher && item.teacher_name) {
        unique.set(item.teacher, item.teacher_name);
      }
    });

    return ["all", ...Array.from(unique.entries())];
  }, [researches]);

  const years = useMemo(() => {
    const unique = new Set();

    researches.forEach((item) => {
      if (item.start_year) unique.add(item.start_year);
      if (item.end_year) unique.add(item.end_year);
    });

    return ["all", ...Array.from(unique).sort((a, b) => b - a)];
  }, [researches]);

  const filteredResearches = useMemo(() => {
    return researches.filter((item) => {
      const matchesSearch =
        item.project_title?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase()) ||
        item.teacher_name?.toLowerCase().includes(search.toLowerCase());

      const matchesTeacher =
        teacherFilter === "all"
          ? true
          : String(item.teacher) === String(teacherFilter);

      const matchesYear =
        yearFilter === "all"
          ? true
          : String(item.start_year) === String(yearFilter) ||
            String(item.end_year) === String(yearFilter);

      return matchesSearch && matchesTeacher && matchesYear;
    });
  }, [researches, search, teacherFilter, yearFilter]);

  const activeCount = researches.filter((item) => !item.end_year).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-[#EEF5F5] dark:from-[#081120] dark:via-[#0C1730] dark:to-[#091728]">
      <section className="px-6 lg:px-16 pt-8">
        <div className="container-custom relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#081120] via-[#10213D] to-[#16335B] px-6 py-10 text-white shadow-[0_25px_80px_rgba(15,23,42,0.18)] lg:px-16 lg:py-14">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#AAF0D1]/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#317873]/10 blur-3xl" />
          </div>

          <nav className="relative mb-5">
            <ol className="flex flex-wrap items-center text-sm sm:text-base font-medium">
              <li>
                <Link
                  to="/"
                  className="text-[#AAF0D1] transition-all duration-200 hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li>
                <span className="mx-2 text-slate-400">›</span>
              </li>
              <li className="text-slate-300">Research</li>
            </ol>
          </nav>

          <div className="relative">
            <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
              Research
            </h1>

            <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#AAF0D1] via-[#317873] to-transparent" />
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-16 mt-10 pb-12">
        <div className="max-w-7xl mx-auto">
          <section className="mb-10 rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-col gap-4 xl:flex-row">
              <input
                type="text"
                placeholder="Search research projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-14 flex-1 rounded-2xl border border-slate-200 bg-white px-5 text-sm outline-none transition focus:border-[#317873] focus:ring-2 focus:ring-[#317873]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />

              <select
                value={teacherFilter}
                onChange={(e) => setTeacherFilter(e.target.value)}
                className="h-14 min-w-[240px] rounded-2xl border border-slate-200 bg-white px-5 text-sm outline-none transition focus:border-[#317873] focus:ring-2 focus:ring-[#317873]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <option value="all">All Teachers</option>
                {teachers
                  .filter((item) => item !== "all")
                  .map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
              </select>

              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="h-14 min-w-[220px] rounded-2xl border border-slate-200 bg-white px-5 text-sm outline-none transition focus:border-[#317873] focus:ring-2 focus:ring-[#317873]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <option value="all">All Years</option>
                {years
                  .filter((item) => item !== "all")
                  .map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
              </select>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-5 md:grid-cols-3 mb-10">
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/5">
              <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                Total Research
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#091728] dark:text-white">
                {researches.length}
              </h2>
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/5">
              <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                Filtered Results
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#091728] dark:text-white">
                {filteredResearches.length}
              </h2>
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/5">
              <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                Ongoing Projects
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#091728] dark:text-white">
                {activeCount}
              </h2>
            </div>
          </section>

          {loading ? (
            <div className="py-20 text-center text-slate-500 dark:text-slate-300">
              Loading research...
            </div>
          ) : filteredResearches.length > 0 ? (
            <section className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredResearches.map((research) => (
                <ResearchCard
                  key={research.id}
                  research={research}
                  onClick={() => setSelectedResearch(research)}
                />
              ))}
            </section>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-16 text-center text-slate-500 shadow-[0_18px_50px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              No research projects found.
            </div>
          )}
        </div>
      </section>

      {selectedResearch && (
        <div
          onClick={() => setSelectedResearch(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden overflow-y-auto rounded-[32px] border border-slate-200/70 bg-white shadow-2xl dark:border-white/10 dark:bg-[#081120]"
          >
            <button
              onClick={() => setSelectedResearch(null)}
              className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-lg transition hover:bg-slate-100 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
            >
              ×
            </button>

            <div className="grid lg:grid-cols-2">
              <div className="min-h-[320px] bg-slate-100 dark:bg-slate-900">
                {selectedResearch.image_url || selectedResearch.image ? (
                  <img
                    src={selectedResearch.image_url || selectedResearch.image}
                    alt={selectedResearch.project_title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    No Preview
                  </div>
                )}
              </div>

              <div className="p-8 lg:p-10">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#317873] dark:text-[#AAF0D1]">
                  {selectedResearch.teacher_name}
                </p>

                <h2 className="mb-6 text-3xl sm:text-4xl font-bold tracking-tight text-[#091728] dark:text-white leading-tight">
                  {selectedResearch.project_title}
                </h2>

                <p className="mb-5 text-sm sm:text-base text-slate-500 dark:text-slate-300">
                  Period: {selectedResearch.period}
                </p>

                <div className="mb-8 flex flex-wrap gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-white/10 dark:text-slate-200">
                    {selectedResearch.status}
                  </span>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                    Start: {selectedResearch.start_year}
                  </span>

                  {selectedResearch.end_year && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                      End: {selectedResearch.end_year}
                    </span>
                  )}
                </div>

                <p className="text-slate-600 leading-8 dark:text-slate-300">
                  {selectedResearch.description || "No description available."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
