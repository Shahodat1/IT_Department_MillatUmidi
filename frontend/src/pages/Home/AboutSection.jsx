import { useEffect, useState } from "react";

function AboutSection() {
  const BASE_URL = "http://127.0.0.1:8000";

  const [department, setDepartment] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [showHead, setShowHead] = useState(false);
  const [loading, setLoading] = useState(true);

  const getImageSrc = (src) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    return `${BASE_URL}${src}`;
  };

  useEffect(() => {
    fetch(`${BASE_URL}/api/departments/`)
      .then((res) => res.json())
      .then((data) => {
        const results = data?.results || data || [];

        if (results.length > 0) {
          setDepartment(results[0]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowHead((prev) => !prev);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="py-20 animate-pulse">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="h-40 bg-gray-300 rounded-2xl"></div>
          <div className="h-40 bg-gray-300 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!department) return null;

  const headPhoto =
    department.head?.photo_url ||
    department.head?.photo ||
    department.head?.image ||
    "";

  const headPhotoSrc = getImageSrc(headPhoto);

  return (
    <section className="bg-white dark:bg-[#091728] text-[#317873]">
      <div className="container-custom mx-auto py-16">
        {!showHead && (
          <div className="grid lg:grid-cols-2 gap-8 items-start animate-fadeIn">
            {/* ABOUT */}
            <div className="rounded-3xl border border-slate-200/70 bg-white p-6 md:p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition-all duration-300 dark:border-white/10 dark:bg-[#1A2644]">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#091728] dark:text-[#AAF0D1] mb-5">
                About Us
              </h2>

              <p className="text-sm sm:text-base text-[#4b5563] dark:text-gray-300 leading-7 text-justify">
                {department.description}
              </p>

              {showMore && (
                <p className="text-sm sm:text-base text-[#4b5563] dark:text-gray-300 leading-7 text-justify mt-4">
                  {department.about_extra}
                </p>
              )}

              {!showMore && (
                <button
                  onClick={() => setShowMore(true)}
                  className="mt-6 text-sm sm:text-base text-[#317873] hover:text-[#245c58] dark:hover:text-[#AAF0D1] transition-all duration-200 font-semibold"
                >
                  Read more →
                </button>
              )}
            </div>

            {/* HOURS */}
            <div className="rounded-3xl border border-slate-200/70 bg-white p-6 md:p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#1A2644]">
              <div className="border-l-4 border-[#317873] pl-4">
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#091728] dark:text-[#AAF0D1] mb-5">
                  Department Hours
                </h3>

                <div className="space-y-4 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  <p>
                    <span className="font-semibold text-[#317873]">
                      Monday - Friday:
                    </span>{" "}
                    {department.monday_friday_hours}
                  </p>

                  <p>
                    <span className="font-semibold text-[#317873]">
                      Saturday:
                    </span>{" "}
                    {department.saturday_hours}
                  </p>

                  <p>
                    <span className="font-semibold text-[#a94444]">
                      Sunday:
                    </span>{" "}
                    {department.sunday_hours}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HEAD */}
        {showHead && department.head && (
          <div className="grid lg:grid-cols-2 gap-12 items-center animate-fadeIn px-16 py-10">
            {/* TEXT */}
            <div className="space-y-4 max-w-[520px]">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#317873] dark:text-[#AAF0D1]">
                HEAD OF
              </h2>

              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#091728] dark:text-white">
                IT DEPARTMENT
              </h3>

              <h6 className="text-2xl sm:text-3xl lg:text-4xl text-[#B69B83] font-semibold leading-tight">
                {department.head.first_name} {department.head.last_name}
              </h6>

              <p className="text-sm sm:text-base text-[#4b5563] dark:text-gray-300 leading-7">
                {department.head.bio}
              </p>
            </div>

            {/* IMAGE */}
            <div className="flex justify-center">
              <div className="relative w-[230px] h-[230px] md:w-[320px] md:h-[320px]">
                <div className="w-full h-full rotate-45 overflow-hidden rounded-3xl border-4 border-[#317873] bg-white dark:bg-[#1A2644] shadow-[0_20px_60px_rgba(15,23,42,0.12)] hover:shadow-[0_0_35px_rgba(49,120,115,0.35)] transition-all duration-500 flex items-center justify-center">
                  {headPhotoSrc ? (
                    <img
                      src={headPhotoSrc}
                      alt="Head"
                      className="w-full h-full object-cover -rotate-45 scale-125"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center -rotate-45 text-[#317873] text-sm sm:text-base font-semibold">
                      No photo
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <style>
          {`
        @keyframes fadeIn {
          from {
            opacity:0;
            transform: translateY(30px);
          }
          to {
            opacity:1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }
        `}
        </style>
      </div>
    </section>
  );
}

export default AboutSection;
