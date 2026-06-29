import { useEffect, useState } from "react";

function DepartmentHeadSection() {
  const [head, setHead] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/teachers/")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        const headTeacher = data.results.find(
          (t) => t.position === "Head of IT Department" && t.is_active,
        );

        setHead(headTeacher);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!head) return null;

  return (
    <section className="relative py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-slate-50 to-[#EEF5F5] dark:from-[#081120] dark:via-[#0C1730] dark:to-[#091728]" />

      <div className="container-custom mx-auto px-4">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-[#317873]/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5">
              <img
                src={head.photo ? head.photo : "/images/deccan.jpg"}
                alt={head.first_name}
                className="h-[360px] w-full object-cover sm:h-[420px] md:h-[480px]"
              />
            </div>
          </div>

          {/* Text */}
          <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 sm:p-8 md:p-10 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="inline-flex items-center rounded-full border border-[#B69B83]/25 bg-[#F7F8FA] px-4 py-2 text-xs sm:text-sm font-medium text-[#7A644F] dark:bg-white/5 dark:text-[#AAF0D1]">
              Department Leadership
            </div>

            <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-[#091728] dark:text-[#AAF0D1] leading-tight">
              About the Head of Department
            </h2>

            <div className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#317873] to-[#AAF0D1]" />

            <p className="mt-6 text-sm sm:text-base md:text-[17px] leading-7 sm:leading-8 text-slate-600 dark:text-slate-300">
              {head.bio
                ? head.bio
                : "Under the leadership of the head of the department, recent years have witnessed an increase in scientific publications, international conferences, startup projects, and advanced IT initiatives."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DepartmentHeadSection;
