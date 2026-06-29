import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarDays,
  Megaphone,
  Award,
  GraduationCap,
  CalendarCheck2,
  ClipboardList,
  Menu,
  Search,
  PanelLeftClose,
  Moon,
  SunMedium,
  Home,
  X,
  ChevronRight,
  Image,
  Handshake,
  BarChart3,
} from "lucide-react";

const navItems = [
  {
    to: "/admin-dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  { to: "/admin-dashboard/teachers", label: "Teachers", icon: Users },
  { to: "/admin-dashboard/students", label: "Students", icon: GraduationCap },
  { to: "/admin-dashboard/courses", label: "Courses", icon: BookOpen },

  {
    to: "/admin-dashboard/gallery-items",
    label: "GalleryItems",
    icon: Image,
  },
  {
    to: "/admin-dashboard/publications",
    label: "Publications",
    icon: Image,
  },
  {
    to: "/admin-dashboard/departments",
    label: "Departments",
    icon: CalendarDays,
  },
  { to: "/admin-dashboard/events", label: "Events", icon: CalendarDays },
  {
    to: "/admin-dashboard/announcements",
    label: "Announcements",
    icon: Megaphone,
  },
  { to: "/admin-dashboard/certificates", label: "Certificates", icon: Award },
  {
    to: "/admin-dashboard/partners",
    label: "Partners",
    icon: Handshake,
  },
  {
    to: "/admin-dashboard/statistics",
    label: "Statistics",
    icon: BarChart3,
  },
  {
    to: "/admin-dashboard/semesters",
    label: "Semesters",
    icon: CalendarDays,
  },

  {
    to: "/admin-dashboard/audit-logs",
    label: "Audit Logs",
    icon: ClipboardList,
  },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("admin-dark") === "true";
  });

  useEffect(() => {
    localStorage.setItem("admin-dark", String(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const linkClass = ({ isActive }) =>
    [
      "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition",
      isActive
        ? "bg-indigo-50 text-indigo-700 shadow-sm dark:bg-white/10 dark:text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white",
    ].join(" ");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen">
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar overlay"
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={[
            "fixed inset-y-0 left-0 z-40 w-72 px-5 py-6 transition-transform duration-300 lg:static lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            darkMode
              ? "border-r border-slate-800 bg-slate-950"
              : "border-r border-slate-200 bg-white shadow-sm",
          ].join(" ")}
        >
          <div className="mb-8 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500 font-bold text-white">
                IT
              </div>
              <div>
                <h1
                  className={`text-lg font-semibold ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  IT Department
                </h1>
                <p
                  className={`text-xs ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Admin Dashboard
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-xl p-2 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={linkClass}>
                <Icon className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">{label}</span>
                <ChevronRight className="ml-auto h-4 w-4 opacity-60" />
              </NavLink>
            ))}
          </nav>

          <div
            className={`mt-8 rounded-3xl p-4 text-sm ${
              darkMode
                ? "border border-white/10 bg-white/5 text-slate-300"
                : "border border-slate-200 bg-slate-50 text-slate-600"
            }`}
          >
            <p
              className={`font-medium ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Quick note
            </p>
            <p className="mt-2 leading-6">
              Manage teachers, courses, categories, events, announcements,
              certificates, content, and audit logs from one clean panel.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header
            className={`sticky top-0 z-20 border-b backdrop-blur transition-colors duration-300 ${
              darkMode
                ? "border-slate-800 bg-slate-950/80"
                : "border-slate-200 bg-white/80"
            }`}
          >
            <div className="flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className={`rounded-2xl border p-3 transition lg:hidden ${
                  darkMode
                    ? "border-slate-800 hover:bg-slate-900"
                    : "border-slate-200 hover:bg-slate-100"
                }`}
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? (
                  <PanelLeftClose className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>

              <div
                className={`flex flex-1 items-center gap-3 rounded-2xl border px-4 py-3 transition-colors duration-300 ${
                  darkMode
                    ? "border-slate-800 bg-slate-900"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  className={`w-full bg-transparent text-sm outline-none ${
                    darkMode
                      ? "text-slate-100 placeholder:text-slate-400"
                      : "text-slate-900 placeholder:text-slate-400"
                  }`}
                  placeholder="Search teachers, courses, events..."
                />
              </div>

              <button
                type="button"
                onClick={() => setDarkMode((v) => !v)}
                className={`rounded-2xl border p-3 transition ${
                  darkMode
                    ? "border-slate-800 hover:bg-slate-900"
                    : "border-slate-200 hover:bg-slate-100"
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <SunMedium className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              <NavLink
                to="/"
                className={`rounded-2xl border p-3 transition ${
                  darkMode
                    ? "border-slate-800 hover:bg-slate-900"
                    : "border-slate-200 hover:bg-slate-100"
                }`}
                aria-label="Go to home page"
              >
                <Home className="h-5 w-5" />
              </NavLink>

              <div
                className={`flex items-center gap-3 rounded-2xl border px-3 py-2 transition-colors duration-300 ${
                  darkMode
                    ? "border-slate-800 bg-slate-900"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-sm font-semibold text-white">
                  A
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">Admin</p>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Super user
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
