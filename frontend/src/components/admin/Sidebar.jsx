import { NavLink } from "react-router-dom";
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
  X,
  Image,
} from "lucide-react";

const defaultLinks = [
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
    to: "/admin-dashboard/course-categories",
    label: "Course Categories",
    icon: ClipboardList,
  },
  {
    to: "/admin-dashboard/gallery-items",
    label: "Gallery Items",
    icon: Image,
  },

  {
    label: "Publications",
    path: "/admin-dashboard/publications",
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
    to: "/admin-dashboard/audit-logs",
    label: "Audit Logs",
    icon: ClipboardList,
  },
];

export default function Sidebar({
  links = defaultLinks,
  open = true,
  onClose,
  darkMode = false,
}) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 w-72 transform border-r transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          darkMode
            ? "border-slate-800 bg-slate-950 text-slate-100"
            : "border-slate-200 bg-white text-slate-900",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-inherit p-6">
          <div>
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <p
              className={
                darkMode
                  ? "mt-1 text-sm text-slate-400"
                  : "mt-1 text-sm text-slate-500"
              }
            >
              Manage everything in one place
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 p-4">
          {links.map((link) => {
            const Icon = link.icon || ClipboardList;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end ?? false}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                    isActive
                      ? darkMode
                        ? "bg-white/10 text-white"
                        : "bg-slate-900 text-white"
                      : darkMode
                        ? "text-slate-300 hover:bg-white/5 hover:text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  ].join(" ")
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
