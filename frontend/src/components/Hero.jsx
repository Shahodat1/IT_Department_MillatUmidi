import AnnouncementTimeline from "./AnnouncementTimeline";

function AnnouncementSection() {
  return (
    <section className="relative bg-[#1A2644] overflow-hidden">
      {/* Neon shapes */}

      <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-[#00FF9D]/20 rounded-full blur-3xl"></div>

      <div className="absolute top-40 -right-32 w-[28rem] h-[28rem] bg-[#00E5FF]/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 relative z-10 text-center">
        <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#091728] via-[#B69B83] to-[#AAF0D1]">
          IT Department Announcements
        </h1>

        <p className="mt-6 text-lg text-[#E0E0E0] max-w-2xl mx-auto">
          Upcoming and past items related to research talks, workshops, calls,
          and departmental events.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <a
            href="#upcoming-title"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#B69B83] to-[#091728] text-white font-semibold hover:shadow-[0_0_25px_#B69B83] transition"
          >
            View Upcoming
          </a>

          <a
            href="#past-title"
            className="px-6 py-3 rounded-xl border border-[#AAF0D1] text-[#AAF0D1] hover:bg-[#80808012] hover:shadow-[0_0_20px_#AAF0D1] transition"
          >
            View Past
          </a>
        </div>
      </div>

      {/* Timeline */}

      <AnnouncementTimeline />
    </section>
  );
}

export default AnnouncementSection;
