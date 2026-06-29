import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  ExternalLink,
  Sparkles,
  Landmark,
  History,
  RadioTower,
} from "lucide-react";

function HeroSection() {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://127.0.0.1:8000";
  const refs = useRef([]);

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/api/announcements/upcoming/`).then((res) =>
        res.json(),
      ),
      fetch(`${BASE_URL}/api/announcements/past/`).then((res) => res.json()),
      fetch(`${BASE_URL}/api/announcements/?is_featured=true`).then((res) =>
        res.json(),
      ),
    ])
      .then(([upcomingData, pastData, featuredData]) => {
        setUpcoming(upcomingData);
        setPast(pastData);
        setFeatured(featuredData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (upcoming.length === 0 && past.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeIn");
          }
        });
      },
      { threshold: 0.2 },
    );

    refs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [upcoming, past]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (featured.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev === featured.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [featured]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-52 rounded-3xl border border-slate-200/70 bg-slate-100/80 dark:border-white/10 dark:bg-white/5 animate-pulse shadow-sm"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F8FA] dark:bg-[#081120] text-slate-900 dark:text-white">
      {featured.length > 0 && (
        <section className="relative overflow-hidden border-b border-slate-200/70 dark:border-white/10 bg-gradient-to-br from-[#F7F8FA] via-white to-[#EEF5F5] dark:from-[#081120] dark:via-[#0C1730] dark:to-[#10213D]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-28 -right-24 h-72 w-72 rounded-full bg-[#AAF0D1]/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#B69B83]/10 blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 relative">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#B69B83]/25 bg-white/70 dark:bg-white/5 px-4 py-2 text-xs sm:text-sm font-medium text-[#7A644F] dark:text-[#AAF0D1] shadow-sm backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Featured Announcement
              </div>

              <h1 className="mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-[#091728] dark:text-[#F5FBFF] leading-tight">
                {featured[index].title}
              </h1>

              <p className="mt-4 text-sm sm:text-base md:text-lg leading-7 md:leading-8 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                {featured[index].short_description}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  to={`/announcement/${featured[index].slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#091728] px-5 py-2.5 text-sm sm:text-base text-white shadow-lg shadow-slate-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-[#AAF0D1] dark:text-[#081120] dark:hover:bg-[#8ce9c2]"
                >
                  Details <ArrowRight className="h-4 w-4" />
                </Link>

                {featured[index].telegram_link && (
                  <a
                    href={featured[index].telegram_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#B69B83]/40 bg-white/70 px-5 py-2.5 text-sm sm:text-base text-[#5B4A3A] shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#AAF0D1] hover:text-[#091728] dark:bg-white/5 dark:text-slate-200 dark:hover:text-white"
                  >
                    Register <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>

              <div className="mt-8 flex justify-center gap-3">
                {featured.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Go to featured announcement ${i + 1}`}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      index === i
                        ? "w-10 bg-[#091728] dark:bg-[#AAF0D1]"
                        : "w-3 bg-slate-300 hover:bg-[#B69B83] dark:bg-slate-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-12 left-1/2 -translate-x-1/2 h-60 w-60 rounded-full bg-[#AAF0D1]/10 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-14 relative text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B69B83]/25 bg-white/70 dark:bg-white/5 px-4 py-2 text-xs sm:text-sm font-medium text-[#7A644F] dark:text-[#AAF0D1] shadow-sm backdrop-blur">
            <Landmark className="h-4 w-4" />
            IT Department Announcements
          </div>

          <h1 className="mt-6 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[#091728] dark:text-[#F5FBFF] leading-tight">
            Department Timeline
          </h1>

          <p className="mt-4 text-sm sm:text-base md:text-lg leading-7 md:leading-8 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Upcoming and past items related to research talks, workshops, and
            departmental announcements.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-8 relative">
          <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 md:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#091728] text-[#AAF0D1] shadow-md">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#091728] dark:text-white">
                  Upcoming
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Scheduled events and announcements
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {upcoming.map((item, i) => (
                <article
                  key={item.id}
                  ref={(el) => (refs.current[i] = el)}
                  className="transition duration-700"
                >
                  <div className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-[#F8FAFC] to-white p-5 md:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:from-white/8 dark:to-white/5">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#091728] via-[#B69B83] to-[#AAF0D1]" />

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#091728] dark:text-white leading-snug">
                          {item.title}
                        </h3>

                        <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-6 sm:leading-7">
                          {item.short_description}
                        </p>
                      </div>

                      <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-[#AAF0D1]/15 text-[#091728] dark:text-[#AAF0D1]">
                        <RadioTower className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs sm:text-sm text-slate-700 dark:bg-white/10 dark:text-slate-200">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(item.start_date)}
                    </div>

                    <div className="mt-5 flex flex-col sm:flex-row gap-3">
                      <Link
                        to={`/announcement/${item.slug}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#091728] px-5 py-2.5 text-sm sm:text-base text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-[#AAF0D1] dark:text-[#081120] dark:hover:bg-[#8ce9c2]"
                      >
                        Details <ChevronRight className="h-4 w-4" />
                      </Link>

                      {item.telegram_link && (
                        <a
                          href={item.telegram_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#B69B83]/40 bg-white px-5 py-2.5 text-sm sm:text-base text-[#5B4A3A] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#AAF0D1] hover:text-[#091728] dark:bg-white/5 dark:text-slate-200 dark:hover:text-white"
                        >
                          Register <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 md:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B69B83] text-white shadow-md">
                <History className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#091728] dark:text-white">
                  Past
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Archived departmental records
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {past.map((item, i) => (
                <article
                  key={item.id}
                  ref={(el) => (refs.current[upcoming.length + i] = el)}
                  className="transition duration-700"
                >
                  <div className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-[#F8FAFC] to-white p-5 md:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:from-white/8 dark:to-white/5">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B69B83] via-[#D8C4AE] to-[#AAF0D1]" />

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#091728] dark:text-white leading-snug">
                          {item.title}
                        </h3>

                        <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-6 sm:leading-7">
                          {item.short_description}
                        </p>
                      </div>

                      <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B69B83]/15 text-[#7A644F] dark:text-[#AAF0D1]">
                        <Clock3 className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default HeroSection;
