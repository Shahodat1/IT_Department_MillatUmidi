import { Link } from "react-router-dom";

function BreadcrumbSection({ title }) {
  return (
    <div className="bg-white dark:bg-[#091728]">
      <div className="container-custom bg-white dark:bg-[#091728] text-[#317873] py-5">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#081120] via-[#10213D] to-[#16335B] px-6 py-10 md:px-10 lg:px-16 lg:py-14 shadow-[0_25px_80px_rgba(15,23,42,0.18)]">
          {/* Background Glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#AAF0D1]/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#317873]/10 blur-3xl" />
          </div>

          {/* Breadcrumb */}
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

              <li className="text-slate-300">{title}</li>
            </ol>
          </nav>

          {/* Title */}
          <div className="relative">
            <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
              {title}
            </h1>

            <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#AAF0D1] via-[#317873] to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BreadcrumbSection;
