import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { API_BASE } from "../services/adminApi";

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search") || "";

  const [results, setResults] = useState({
    publications: [],
    teachers: [],
    courses: [],
    events: [],
  });

  useEffect(() => {
    if (!query.trim()) return;

    fetch(`${API_BASE}/api/search/?search=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        setResults({
          publications: data.publications || [],
          teachers: data.teachers || [],
          courses: data.courses || [],
          events: data.events || [],
        });
      })
      .catch((err) => console.error("Search error:", err));
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Search results for "{query}"</h1>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">Teachers</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {results.teachers.length > 0 ? (
            results.teachers.map((teacher) => (
              <Link
                key={teacher.id}
                to={`/teachers/${teacher.id}`}
                className="rounded-xl border bg-white p-4 shadow-sm"
              >
                <h3 className="text-lg font-semibold">
                  {teacher.first_name} {teacher.last_name}
                </h3>
                <p className="text-sm text-gray-500">{teacher.position}</p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">No teachers found.</p>
          )}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">Courses</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {results.courses.length > 0 ? (
            results.courses.map((course) => (
              <Link
                key={course.id}
                to={`/course_detail/${course.code}`}
                className="rounded-xl border bg-white p-4 shadow-sm"
              >
                <h3 className="text-lg font-semibold">{course.name}</h3>
                <p className="text-sm text-gray-500">{course.code}</p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">No courses found.</p>
          )}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">Publications</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {results.publications.length > 0 ? (
            results.publications.map((pub) => (
              <Link
                key={pub.id}
                to={`/publications/${pub.id}`}
                className="rounded-xl border bg-white p-4 shadow-sm"
              >
                <h3 className="text-lg font-semibold">{pub.title}</h3>
                <p className="text-sm text-gray-500">{pub.journal}</p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">No publications found.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Events</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {results.events.length > 0 ? (
            results.events.map((event) => (
              <Link
                key={event.id}
                to={`/events`}
                className="rounded-xl border bg-white p-4 shadow-sm"
              >
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-500">{event.location}</p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">No events found.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default SearchResultsPage;
