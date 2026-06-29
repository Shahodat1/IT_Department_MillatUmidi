import { useEffect, useState } from "react";
import { API_BASE } from "../../services/adminApi";

function DepartmentStatistics() {
  const BASE_URL = API_BASE;

  const [professors, setProfessors] = useState(0);
  const [students, setStudents] = useState(0);
  const [foreignStudents, setForeignStudents] = useState(0);
  const [graduates, setGraduates] = useState(0);

  const animateCounter = (target, setter) => {
    let start = 0;
    const speed = 40;

    const step = () => {
      start += Math.ceil(target / speed);

      if (start < target) {
        setter(start);
        requestAnimationFrame(step);
      } else {
        setter(target);
      }
    };

    step();
  };

  useEffect(() => {
    fetch(`${BASE_URL}/api/statistics/`)
      .then((res) => res.json())
      .then((data) => {
        const results = data?.results || data || [];

        const prof = results.find((item) => item.name === "Professors");
        const stud = results.find((item) => item.name === "Students");
        const foreign = results.find(
          (item) => item.name === "Foreign Students",
        );
        const grad = results.find((item) => item.name === "Graduates");

        if (prof) animateCounter(Number(prof.value) || 0, setProfessors);
        if (stud) animateCounter(Number(stud.value) || 0, setStudents);
        if (foreign)
          animateCounter(Number(foreign.value) || 0, setForeignStudents);
        if (grad) animateCounter(Number(grad.value) || 0, setGraduates);
      })
      .catch((error) => {
        console.error("Statistics fetch error:", error);
      });
  }, []);

  return (
    <section className="bg-white dark:bg-[#091728] text-[#317873]">
      <div className="container-custom py-6">
        <style>
          {`
          @keyframes lineMove {
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

          .moving-stat-line {
            animation: lineMove 1.8s linear infinite;
          }
        `}
        </style>

        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal mb-3 dark:text-[#AAF0D1] text-[#091728]">
            Department Statistics
          </h2>

          <div className="relative w-24 h-1 mx-auto overflow-hidden rounded-full bg-[#d8f3ea] dark:bg-[#1f355f]">
            <div className="absolute top-0 left-0 h-full w-10 rounded-full bg-[#317873] moving-stat-line shadow-[0_0_12px_rgba(49,120,115,0.7)]" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <StatCard title="Professors" value={professors} />
          <StatCard title="Students" value={students} />
          <StatCard title="Foreign Students" value={foreignStudents} />
          <StatCard title="Graduates" value={graduates} />
        </div>
      </div>
    </section>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-[#1A2644] text-[#091728] dark:text-white rounded-lg shadow-darkblue p-6">
      <div className="text-2xl sm:text-3xl font-bold">{value}</div>
      <div className="mt-2 text-sm sm:text-base font-semibold">{title}</div>
    </div>
  );
}

export default DepartmentStatistics;
