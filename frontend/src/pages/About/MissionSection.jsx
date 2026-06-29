function MissionSection() {
  return (
    <section className="relative py-20 font-poppins">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-slate-50 to-[#EEF5F5] dark:from-[#081120] dark:via-[#0C1730] dark:to-[#091728]" />

      <div className="container-custom px-4">
        <div className="animate-slide-up overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/80 p-8 sm:p-10 md:p-14 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/5">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-[#B69B83]/25 bg-[#F7F8FA] px-4 py-2 text-xs sm:text-sm font-medium text-[#7A644F] shadow-sm dark:bg-white/5 dark:text-[#AAF0D1]">
            Department Mission
          </div>

          {/* Title */}
          <h2 className="mt-6 max-w-4xl text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#091728] dark:text-[#AAF0D1] leading-tight">
            "Innovate. Build. Empower."
          </h2>

          <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#317873] via-[#AAF0D1] to-transparent" />

          {/* Text */}
          <p className="mt-7 max-w-5xl text-sm sm:text-base md:text-[17px] leading-7 sm:leading-8 text-slate-600 dark:text-slate-300 font-noto">
            Our department thrives on solving real-world problems with next-gen
            technologies. Whether AI, data science, or software, our goal is to
            create meaningful impact.
          </p>
        </div>
      </div>
    </section>
  );
}

export default MissionSection;
