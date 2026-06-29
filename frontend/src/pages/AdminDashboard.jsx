// src/pages/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarDays,
  Megaphone,
  Award,
  GraduationCap,
  Menu,
  Search,
  Bell,
  ChevronRight,
} from "lucide-react";
import { apiGet, normalizeList } from "../lib/adminApi";

const SidebarItem = ({ icon: Icon, label, to, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
        isActive
          ? "bg-white/10 text-white"
          : "text-slate-300 hover:bg-white/5 hover:text-white"
      }`
    }
  >
    <Icon className="h-5 w-5" />
    <span className="text-sm font-medium">{label}</span>
    <ChevronRight className="ml-auto h-4 w-4 opacity-60" />
  </NavLink>
);

const StatCard = ({ label, value, icon: Icon, to }) => {
  const content = (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 text-sm font-medium text-emerald-600">
        Live API data
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

function getFullName(item) {
  const first = item?.first_name || "";
  const last = item?.last_name || "";
  const combined = `${first} ${last}`.trim();
  return combined || item?.name || item?.full_name || "Unnamed";
}

function getSafeDate(item) {
  return (
    item?.start_date ||
    item?.created_at ||
    item?.date_issued ||
    item?.registered_at ||
    "-"
  );
}

export default function AdminDashboard() {
  const [openSidebar, setOpenSidebar] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          teachersRes,
          coursesRes,
          eventsRes,
          announcementsRes,
          certificatesRes,
          studentsRes,
        ] = await Promise.all([
          apiGet("/teachers/"),
          apiGet("/courses/"),
          apiGet("/events/"),
          apiGet("/announcements/"),
          apiGet("/certificates/"),
          apiGet("/students/"),
        ]);

        if (!mounted) return;

        setTeachers(normalizeList(teachersRes));
        setCourses(normalizeList(coursesRes));
        setEvents(normalizeList(eventsRes));
        setAnnouncements(normalizeList(announcementsRes));
        setCertificates(normalizeList(certificatesRes));
        setStudents(normalizeList(studentsRes));
      } catch (e) {
        if (mounted) {
          console.error(e);
          setError("Data API dan yuklanmadi.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      {
        label: "Teachers",
        value: teachers.length,
        icon: Users,
        to: "/admin-dashboard/teachers",
      },
      {
        label: "Courses",
        value: courses.length,
        icon: BookOpen,
        to: "/admin-dashboard/courses",
      },
      {
        label: "Students",
        value: students.length,
        icon: GraduationCap,
        to: "/admin-dashboard/students",
      },
      {
        label: "Events",
        value: events.length,
        icon: CalendarDays,
        to: "/admin-dashboard/events",
      },
      {
        label: "Announcements",
        value: announcements.length,
        icon: Megaphone,
        to: "/admin-dashboard/announcements",
      },
      {
        label: "Certificates",
        value: certificates.length,
        icon: Award,
        to: "/admin-dashboard/certificates",
      },
    ],
    [teachers, courses, students, events, announcements, certificates],
  );

  const recentTeachers = teachers.slice(0, 5);
  const recentActivity = [
    ...events.slice(0, 3).map((item) => ({
      id: `event-${item.id}`,
      title: item.title || "Event",
      date: getSafeDate(item),
      type: "Event",
    })),
    ...announcements.slice(0, 2).map((item) => ({
      id: `ann-${item.id}`,
      title: item.title || "Announcement",
      date: getSafeDate(item),
      type: "Announcement",
    })),
  ].slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-slate-950 px-5 py-6 transition-transform duration-300 lg:static lg:translate-x-0 ${
            openSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500 font-bold text-white">
              IT
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">
                IT Department
              </h1>
              <p className="text-xs text-slate-400">Admin Dashboard</p>
            </div>
          </div>

          <nav className="space-y-2">
            <SidebarItem
              to="/admin-dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
              end
            />
            <SidebarItem
              to="/admin-dashboard/teachers"
              icon={Users}
              label="Teachers"
            />
            <SidebarItem
              to="/admin-dashboard/courses"
              icon={BookOpen}
              label="Courses"
            />
            <SidebarItem
              to="/admin-dashboard/events"
              icon={CalendarDays}
              label="Events"
            />
            <SidebarItem
              to="/admin-dashboard/announcements"
              icon={Megaphone}
              label="Announcements"
            />
            <SidebarItem
              to="/admin-dashboard/certificates"
              icon={Award}
              label="Certificates"
            />
            <SidebarItem
              to="/admin-dashboard/students"
              icon={GraduationCap}
              label="Students"
            />
          </nav>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            <p className="font-medium text-white">Quick note</p>
            <p className="mt-2 leading-6">
              Manage courses, teachers, events, and content from one clean
              control panel.
            </p>
          </div>
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <button
                onClick={() => setOpenSidebar((v) => !v)}
                className="rounded-2xl border border-slate-200 p-3 lg:hidden"
                aria-label="Toggle sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  placeholder="Search teachers, courses, events..."
                />
              </div>

              <button className="rounded-2xl border border-slate-200 p-3">
                <Bell className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-sm font-semibold text-white">
                  A
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">Admin</p>
                  <p className="text-xs text-slate-500">Super user</p>
                </div>
              </div>
            </div>
          </header>

          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Dashboard Overview
              </h2>
              <p className="text-sm text-slate-500">
                Clean overview of the department activity, content, and
                management tools.
              </p>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                Loading dashboard data...
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
                {error}
              </div>
            ) : (
              <>
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {stats.map((item) => (
                    <StatCard key={item.label} {...item} />
                  ))}
                </section>

                <section className="mt-8 grid gap-6 lg:grid-cols-3">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Recent Teachers
                        </h3>
                        <p className="text-sm text-slate-500">
                          Latest added or updated staff members
                        </p>
                      </div>
                      <Link
                        to="/admin-dashboard/teachers"
                        className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                      >
                        View all
                      </Link>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                              Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                              Position
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                              Email
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {recentTeachers.length ? (
                            recentTeachers.map((row) => {
                              const name = getFullName(row);
                              const isActive = row.is_active !== false;

                              return (
                                <tr key={row.id || row.email || name}>
                                  <td className="px-4 py-4 text-sm font-medium">
                                    {name}
                                  </td>
                                  <td className="px-4 py-4 text-sm text-slate-600">
                                    {row.position || "-"}
                                  </td>
                                  <td className="px-4 py-4 text-sm text-slate-600">
                                    {row.email || "-"}
                                  </td>
                                  <td className="px-4 py-4">
                                    <span
                                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                        isActive
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-amber-100 text-amber-700"
                                      }`}
                                    >
                                      {isActive ? "Active" : "Inactive"}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td
                                className="px-4 py-5 text-sm text-slate-500"
                                colSpan={4}
                              >
                                No teachers found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-5">
                      <h3 className="text-lg font-semibold">Recent Activity</h3>
                      <p className="text-sm text-slate-500">
                        Events and announcements
                      </p>
                    </div>

                    <div className="space-y-4">
                      {recentActivity.length ? (
                        recentActivity.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-2xl bg-slate-50 p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-medium text-slate-900">
                                  {item.title}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                  {item.date}
                                </p>
                              </div>
                              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                                {item.type}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                          No recent activity found.
                        </div>
                      )}
                    </div>

                    <div className="mt-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white">
                      <p className="text-sm text-slate-300">System status</p>
                      <p className="mt-1 text-2xl font-bold">Healthy</p>
                      <p className="mt-2 text-sm text-slate-300">
                        All API endpoints and dashboard sections are ready.
                      </p>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
