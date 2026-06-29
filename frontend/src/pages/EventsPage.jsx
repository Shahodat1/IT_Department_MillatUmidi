import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(timeStr) {
  if (!timeStr) return "N/A";
  if (timeStr.length >= 5) return timeStr.slice(0, 5);
  return timeStr;
}

function getYear(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).getFullYear();
}

function getMonth(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr)
    .toLocaleString("en-US", { month: "long" })
    .toLowerCase();
}

function extractYoutubeEmbed(url) {
  if (!url) return null;

  const match =
    url.match(/youtu\.be\/([A-Za-z0-9_-]+)/) ||
    url.match(/v=([A-Za-z0-9_-]+)/) ||
    url.match(/embed\/([A-Za-z0-9_-]+)/);

  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);
  const [sortBy, setSortBy] = useState("all");
  const [loading, setLoading] = useState(true);

  const [registerOpen, setRegisterOpen] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/events/`);
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.results || [];
        setEvents(items);
        if (items.length > 0) setActiveEvent(items[0]);
      } catch (error) {
        console.error("Events yuklanmadi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    let items = [...events];

    if (sortBy.startsWith("year-")) {
      const year = Number(sortBy.replace("year-", ""));
      items = items.filter((ev) => getYear(ev.start_date) === year);
    }

    if (sortBy.startsWith("month-")) {
      const month = sortBy.replace("month-", "");
      items = items.filter((ev) => getMonth(ev.start_date) === month);
    }

    return items;
  }, [events, sortBy]);

  useEffect(() => {
    if (filteredEvents.length > 0) {
      const stillExists = activeEvent
        ? filteredEvents.some((item) => item.id === activeEvent.id)
        : false;

      if (!stillExists) {
        setActiveEvent(filteredEvents[0]);
      }
    } else {
      setActiveEvent(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredEvents]);

  useEffect(() => {
    setRegisterError("");
    setRegisterSuccess("");
  }, [activeEvent]);

  const mediaUrl = activeEvent
    ? extractYoutubeEmbed(activeEvent.video_url)
    : null;
  const mediaImage =
    activeEvent?.image_display || activeEvent?.image_url || "/default.jpg";

  const handleRegisterSubmit = async () => {
    if (!activeEvent) return;

    if (!formData.full_name.trim() || !formData.email.trim()) {
      setRegisterError("Full name va email majburiy.");
      return;
    }

    setRegisterError("");
    setRegisterSuccess("");
    setRegisterLoading(true);

    try {
      const res = await fetch(`${API_URL}/event-registrations/public/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: activeEvent.id,
          full_name: formData.full_name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message =
          data?.detail ||
          data?.message ||
          data?.non_field_errors?.[0] ||
          data?.error ||
          "Registration amalga oshmadi";
        throw new Error(message);
      }

      setRegisterSuccess("Siz eventga muvaffaqiyatli ro‘yxatdan o‘tdingiz.");
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        message: "",
      });

      setTimeout(() => {
        setRegisterOpen(false);
        setRegisterSuccess("");
      }, 1200);
    } catch (error) {
      setRegisterError(error.message || "Registration xatoligi");
    } finally {
      setRegisterLoading(false);
    }
  };

  const closeModal = () => {
    if (registerLoading) return;
    setRegisterOpen(false);
    setRegisterError("");
    setRegisterSuccess("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-[#EEF5F5] dark:from-[#081120] dark:via-[#0C1730] dark:to-[#091728] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="h-10 w-56 rounded-full bg-slate-200/80 dark:bg-white/10 animate-pulse" />
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="h-[460px] rounded-3xl bg-slate-200/80 dark:bg-white/10 animate-pulse" />
              <div className="mt-6 h-64 rounded-3xl bg-slate-200/80 dark:bg-white/10 animate-pulse" />
            </div>
            <div className="lg:col-span-4">
              <div className="h-[560px] rounded-3xl bg-slate-200/80 dark:bg-white/10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <li className="text-slate-300">Events & Timeline</li>
            </ol>
          </nav>

          <div className="relative">
            <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
              Events & Timeline
            </h1>

            <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#AAF0D1] via-[#317873] to-transparent" />
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-16 mt-10 pb-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <main className="lg:col-span-8">
            <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#1A2644]">
              {mediaUrl ? (
                <iframe
                  className="h-[320px] w-full sm:h-[400px] lg:h-[460px]"
                  src={mediaUrl}
                  title={activeEvent?.title || "Event"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  src={mediaImage}
                  alt={activeEvent?.title || "Event"}
                  className="h-[320px] w-full object-cover sm:h-[400px] lg:h-[460px]"
                />
              )}
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#1A2644]">
              {activeEvent ? (
                <>
                  <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#091728] dark:text-white">
                    {activeEvent.title}
                  </h3>

                  <div className="mt-4 space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="font-medium text-[#091728] dark:text-white">
                        Time:
                      </span>{" "}
                      {formatTime(activeEvent.start_time)}
                    </div>

                    <div>
                      <span className="font-medium text-[#091728] dark:text-white">
                        Event Name:
                      </span>{" "}
                      {activeEvent.title}
                    </div>

                    <div>
                      <span className="font-medium text-[#091728] dark:text-white">
                        Date:
                      </span>{" "}
                      {formatDate(activeEvent.start_date)}
                      {activeEvent.end_date
                        ? ` — ${formatDate(activeEvent.end_date)}`
                        : ""}
                    </div>

                    <div>
                      <span className="font-medium text-[#091728] dark:text-white">
                        Location:
                      </span>{" "}
                      {activeEvent.location}
                    </div>

                    <div>
                      <span className="font-medium text-[#091728] dark:text-white">
                        Guest Lecture:
                      </span>{" "}
                      {activeEvent.speaker_display ||
                        activeEvent.speaker_name ||
                        "N/A"}
                    </div>

                    <div className="whitespace-pre-line">
                      <span className="font-medium text-[#091728] dark:text-white">
                        Information:
                      </span>{" "}
                      {activeEvent.description}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-slate-500 dark:text-slate-300">
                  No event selected.
                </p>
              )}
            </div>
          </main>

          <aside className="lg:col-span-4 lg:pl-4">
            <div className="mb-6 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#1A2644]">
              <label
                htmlFor="ev-filter"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Sort by
              </label>

              <select
                id="ev-filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#317873] focus:ring-2 focus:ring-[#317873]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <option value="all">All</option>
                <option value="year-2026">Year: 2026</option>
                <option value="year-2025">Year: 2025</option>
                <option value="month-june">Month: June</option>
                <option value="month-july">Month: July</option>
                <option value="month-september">Month: September</option>
              </select>
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#1A2644] lg:max-h-[70vh] lg:overflow-y-auto">
              <h2 className="mb-4 text-lg font-semibold tracking-tight text-[#091728] dark:text-white">
                Timeline 2025–2026
              </h2>

              <ul className="space-y-4">
                {filteredEvents.map((event) => (
                  <li
                    key={event.id}
                    onClick={() => setActiveEvent(event)}
                    className={`relative cursor-pointer rounded-2xl border-l-2 px-4 py-3 transition-all duration-200 ${
                      activeEvent?.id === event.id
                        ? "border-[#317873] bg-[#317873]/5"
                        : "border-[#317873]/30 bg-transparent hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="absolute -left-[7px] top-4 h-3 w-3 rounded-full bg-[#317873]" />
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(event.start_date)}
                    </div>
                    <div className="mt-1 font-medium text-[#091728] dark:text-white">
                      {event.title}
                    </div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                      {event.location}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
