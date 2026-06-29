import { useEffect, useState } from "react";
import { API_BASE } from "../../services/adminApi";

function AnnouncementTimeline() {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/announcements/`),
      fetch(`${API_BASE}/api/events/`),
    ])
      .then(([aRes, eRes]) => Promise.all([aRes.json(), eRes.json()]))
      .then(([aData, eData]) => {
        const announcements = aData.results || aData;
        const events = eData.results || eData;

        const formattedAnnouncements = announcements.map((a) => ({
          id: `ann-${a.id}`,
          title: a.title,
          content: a.content,
          date: a.start_date || a.date_posted,
          type: a.type,
          location: null,
        }));

        const formattedEvents = events.map((e) => ({
          id: `event-${e.id}`,
          title: e.title,
          content: e.description,
          date: e.start_date,
          type: "event",
          location: e.location,
        }));

        const combined = [...formattedAnnouncements, ...formattedEvents];

        const today = new Date();

        const upcomingList = combined.filter(
          (item) => item.date && new Date(item.date) >= today,
        );

        const pastList = combined.filter(
          (item) => item.date && new Date(item.date) < today,
        );

        upcomingList.sort((a, b) => new Date(a.date) - new Date(b.date));
        pastList.sort((a, b) => new Date(b.date) - new Date(a.date));

        setUpcoming(upcomingList);
        setPast(pastList);
      });
  }, []);

  const Card = ({ item, past = false }) => (
    <div
      className={`group rounded-3xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        past
          ? "border-slate-200 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80"
          : "border-white/10 bg-white/10 backdrop-blur-xl"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
            past
              ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              : "bg-[#317873]/20 text-[#e8fff8]"
          }`}
        >
          {item.type}
        </span>

        <span
          className={`text-xs font-medium ${
            past ? "text-slate-400" : "text-white/70"
          }`}
        >
          {item.date}
        </span>
      </div>

      <h3
        className={`text-2xl font-semibold tracking-tight transition-colors ${
          past
            ? "text-slate-900 group-hover:text-[#317873] dark:text-white dark:group-hover:text-[#8be0cf]"
            : "text-[#AAF0D1] group-hover:text-white"
        }`}
      >
        {item.title}
      </h3>

      <p
        className={`mt-3 leading-7 ${
          past ? "text-slate-600 dark:text-slate-300" : "text-white/80"
        }`}
      >
        {item.content}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 ${
            past
              ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
              : "bg-white/10 text-white/80"
          }`}
        >
          📅 {item.start_date}
        </span>

        {item.location && (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 ${
              past
                ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                : "bg-white/10 text-white/80"
            }`}
          >
            📍 {item.location}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1A2644] to-[#0b1b1b] py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(49,120,115,0.28),transparent_30%),radial-gradient(circle_at_top_right,rgba(170,240,209,0.14),transparent_28%)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#AAF0D1]">
            Timeline
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Announcements & Events
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Upcoming updates and past highlights are displayed in one elegant
            timeline.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#AAF0D1]">
                Upcoming
              </h2>
              <span className="rounded-full bg-[#317873]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#CAF7EA]">
                Next
              </span>
            </div>

            <div className="space-y-6">
              {upcoming.map((item) => (
                <Card key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-2xl backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950/50">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Past
              </h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                Archive
              </span>
            </div>

            <div className="space-y-6">
              {past.map((item) => (
                <Card key={item.id} item={item} past />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AnnouncementTimeline;
