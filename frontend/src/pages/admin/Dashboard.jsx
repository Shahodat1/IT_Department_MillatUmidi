import { useEffect, useState } from "react";
import StatCard from "../../components/admin/StatCard";
import DataTable from "../../components/admin/DataTable";
import Topbar from "../../components/admin/Topbar";
import { extractItems, request } from "../../services/adminApi";

function getCount(payload) {
  if (!payload) return 0;
  if (typeof payload.count === "number") return payload.count;
  if (Array.isArray(payload)) return payload.length;
  return extractItems(payload).length;
}

function getRecentItems(payload, limit = 5) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload.slice(0, limit);
  if (Array.isArray(payload.results)) return payload.results.slice(0, limit);
  return extractItems(payload).slice(0, limit);
}

export default function Dashboard() {
  const [stats, setStats] = useState([
    {
      title: "Teachers",
      value: 0,
      subtitle: "Registered teachers",
      accent: "bg-blue-500",
    },
    {
      title: "Students",
      value: 0,
      subtitle: "Registered students",
      accent: "bg-emerald-500",
    },
    {
      title: "Courses",
      value: 0,
      subtitle: "Available courses",
      accent: "bg-violet-500",
    },
    {
      title: "Events",
      value: 0,
      subtitle: "Upcoming events",
      accent: "bg-amber-500",
    },
    {
      title: "Gallery Items",
      value: 0,
      subtitle: "Media library items",
      accent: "bg-cyan-500",
    },
  ]);

  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentGalleryItems, setRecentGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      const results = await Promise.allSettled([
        request("/api/teachers/"),
        request("/api/students/"),
        request("/api/courses/"),
        request("/api/events/"),
        request("/api/announcements/"),
        request("/api/gallery-items/"),
      ]);

      const teacherRes = results[0];
      const studentRes = results[1];
      const courseRes = results[2];
      const eventRes = results[3];
      const announcementRes = results[4];
      const galleryRes = results[5];

      const teacherPayload =
        teacherRes.status === "fulfilled" ? teacherRes.value : null;
      const studentPayload =
        studentRes.status === "fulfilled" ? studentRes.value : null;
      const coursePayload =
        courseRes.status === "fulfilled" ? courseRes.value : null;
      const eventPayload =
        eventRes.status === "fulfilled" ? eventRes.value : null;
      const announcementPayload =
        announcementRes.status === "fulfilled" ? announcementRes.value : null;
      const galleryPayload =
        galleryRes.status === "fulfilled" ? galleryRes.value : null;

      setStats([
        {
          title: "Teachers",
          value: getCount(teacherPayload),
          subtitle: "Registered teachers",
          accent: "bg-blue-500",
        },
        {
          title: "Students",
          value: getCount(studentPayload),
          subtitle: "Registered students",
          accent: "bg-emerald-500",
        },
        {
          title: "Courses",
          value: getCount(coursePayload),
          subtitle: "Available courses",
          accent: "bg-violet-500",
        },
        {
          title: "Events",
          value: getCount(eventPayload),
          subtitle: "Upcoming events",
          accent: "bg-amber-500",
        },
        {
          title: "Gallery Items",
          value: getCount(galleryPayload),
          subtitle: "Media library items",
          accent: "bg-cyan-500",
        },
      ]);

      setRecentEvents(getRecentItems(eventPayload, 5));
      setRecentAnnouncements(getRecentItems(announcementPayload, 5));
      setRecentGalleryItems(getRecentItems(galleryPayload, 5));

      setLoading(false);
    };

    loadDashboard();
  }, []);

  const announcementColumns = [
    { key: "title", label: "Title" },
    {
      key: "status",
      label: "Status",
      render: (row) => row.status || row.type || "Published",
    },
  ];

  const eventColumns = [
    { key: "title", label: "Title" },
    {
      key: "date",
      label: "Date",
      render: (row) => row.start_date || row.date || "-",
    },
    {
      key: "location",
      label: "Location",
      render: (row) => row.location || "-",
    },
  ];

  const galleryColumns = [
    { key: "title", label: "Title" },
    {
      key: "section",
      label: "Section",
      render: (row) => row.section_display || row.section || "-",
    },
    {
      key: "teacher",
      label: "Teacher",
      render: (row) => row.teacher_name || "-",
    },
    {
      key: "year_month",
      label: "Year / Month",
      render: (row) =>
        `${row.year || "-"} / ${row.month_display || row.month || "-"}`,
    },
    {
      key: "active",
      label: "Active",
      render: (row) => (row.is_active ? "Yes" : "No"),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <Topbar title="Dashboard" subtitle="Overview of your admin panel" />

      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {stats.map((item) => (
            <StatCard
              key={item.title}
              title={item.title}
              value={loading ? "..." : item.value}
              subtitle={item.subtitle}
              accent={item.accent}
            />
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
              Recent Announcements
            </h2>
            <DataTable
              columns={announcementColumns}
              data={recentAnnouncements}
              loading={loading}
              emptyMessage="No announcements yet"
            />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
              Recent Events
            </h2>
            <DataTable
              columns={eventColumns}
              data={recentEvents}
              loading={loading}
              emptyMessage="No events yet"
            />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
              Recent Gallery Items
            </h2>
            <DataTable
              columns={galleryColumns}
              data={recentGalleryItems}
              loading={loading}
              emptyMessage="No gallery items yet"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
