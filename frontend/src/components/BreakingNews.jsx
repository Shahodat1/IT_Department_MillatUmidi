import { useEffect, useRef, useState } from "react";
import axios from "axios";

function BreakingNews() {
  const [news, setNews] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/announcements/breaking/",
      );

      setNews(response.data);
    } catch (error) {
      console.error("Breaking News error:", error);
    }
  };

  const scrollLeft = () => {
    const container = scrollRef.current;
    if (!container) return;

    const card = container.querySelector("div");
    if (!card) return;

    const cardWidth = card.offsetWidth + 24;

    container.scrollBy({
      left: -cardWidth * 3,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    const container = scrollRef.current;
    if (!container) return;

    const card = container.querySelector("div");
    if (!card) return;

    const cardWidth = card.offsetWidth + 24;

    container.scrollBy({
      left: cardWidth * 3,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative py-14 bg-gradient-to-b from-white via-slate-50 to-[#EEF5F5] dark:from-[#081120] dark:via-[#0C1730] dark:to-[#091728]">
      <style>
        {`
          @keyframes breakingLineMove {
            0% {
              transform: translateX(-120%);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translateX(220%);
              opacity: 0;
            }
          }

          .moving-breaking-line {
            animation: breakingLineMove 1.8s linear infinite;
          }
        `}
      </style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mb-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#091728] dark:text-[#AAF0D1]">
              Breaking News
            </h2>

            <div className="relative w-24 h-1 mx-auto mt-4 overflow-hidden rounded-full bg-[#d8f3ea] dark:bg-[#1f355f]">
              <div className="absolute top-0 left-0 h-full w-10 rounded-full bg-[#317873] moving-breaking-line shadow-[0_0_12px_rgba(49,120,115,0.7)]" />
            </div>
          </div>

          <div className="absolute right-0 top-0 hidden md:flex gap-2">
            <button
              onClick={scrollLeft}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label="Scroll left"
            >
              &#8249;
            </button>

            <button
              onClick={scrollRight}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label="Scroll right"
            >
              &#8250;
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-2"
        >
          {news.map((item) => (
            <div
              key={item.id}
              className="w-full max-w-[320px] sm:max-w-[340px] md:max-w-[calc(100%/3-1rem)] flex-shrink-0 overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-[#1A2644]"
            >
              <div className="relative">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="h-48 w-full object-cover"
                />

                <div className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs sm:text-sm font-medium text-[#317873] shadow-md backdrop-blur dark:bg-[#081120]/90 dark:text-[#AAF0D1]">
                  <svg
                    className="h-4 w-4 text-[#317873] dark:text-[#AAF0D1]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10m-12 5h12m-8 4h4"
                    />
                  </svg>

                  {new Date(item.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="p-5">
                <h3 className="mb-2 text-base sm:text-lg font-semibold leading-snug text-[#091728] dark:text-white">
                  {item.title}
                </h3>

                <p className="text-sm sm:text-base leading-7 text-slate-600 dark:text-slate-300">
                  {item.short_description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BreakingNews;
