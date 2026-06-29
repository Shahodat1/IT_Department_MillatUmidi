import { useEffect, useState } from "react";
import { API_BASE } from "../services/adminApi";

function PartnersSection() {
  const [partners, setPartners] = useState([]);
  const API_BASE_URL = API_BASE;

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/partners/`)
      .then((res) => res.json())
      .then((data) => {
        setPartners(data.results || data || []);
      })
      .catch((err) => console.error(err));
  }, []);

  const getLogoUrl = (logo) => {
    if (!logo) return "";
    if (logo.startsWith("http")) return logo;
    return `${API_BASE_URL}${logo}`;
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#f7f9fc] via-white to-[#eef5f5] py-16 dark:from-[#081120] dark:via-[#0C1730] dark:to-[#091728]">
      <style>
        {`
          @keyframes partnerLineMove {
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

          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes logoFloat {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-4px);
            }
          }

          @keyframes scrollLogos {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .moving-partner-line {
            animation: partnerLineMove 1.8s linear infinite;
          }

          .animate-fade-up {
            animation: fadeUp 0.8s ease forwards;
          }

          .animate-logo-float {
            animation: logoFloat 4s ease-in-out infinite;
          }

          .animate-scroll-logos {
            animation: scrollLogos 28s linear infinite;
          }
        `}
      </style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center animate-fade-up">
          <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#091728] dark:text-[#AAF0D1]">
            Our Partners
          </h2>

          <div className="relative mx-auto mt-4 h-1 w-24 overflow-hidden rounded-full bg-[#d8f3ea] dark:bg-[#1f355f]">
            <div className="absolute left-0 top-0 h-full w-10 rounded-full bg-[#317873] moving-partner-line shadow-[0_0_12px_rgba(49,120,115,0.7)]" />
          </div>
        </div>

        <div className="relative mt-12 w-full overflow-hidden">
          <div className="flex w-max animate-scroll-logos items-center gap-8">
            <div className="flex items-center gap-8">
              {partners?.map((partner, index) => (
                <div
                  key={partner.id}
                  className="group flex min-w-[170px] items-center justify-center rounded-3xl border border-slate-200/70 bg-white px-6 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-white/5 animate-logo-float"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <img
                    src={getLogoUrl(partner.logo)}
                    alt={partner.name}
                    className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-16"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-8">
              {partners?.map((partner, index) => (
                <div
                  key={`duplicate-${partner.id}`}
                  className="group flex min-w-[170px] items-center justify-center rounded-3xl border border-slate-200/70 bg-white px-6 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-white/5 animate-logo-float"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <img
                    src={getLogoUrl(partner.logo)}
                    alt={partner.name}
                    className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-16"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PartnersSection;
