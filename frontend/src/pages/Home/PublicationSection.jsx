import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, BookOpen, ArrowUpRight } from "lucide-react";
import { API_BASE } from "../../services/adminApi";

function PublicationSection() {
  const BASE_URL = API_BASE;
  const navigate = useNavigate();

  const [publications, setPublications] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.is_staff;

  const fetchPublications = async () => {
    try {
      const token = localStorage.getItem("access");

      let res = await fetch(`${BASE_URL}/api/publications/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        res = await fetch(`${BASE_URL}/api/publications/`);
      }

      if (!res.ok) throw new Error("Fetch error");

      const data = await res.json();
      const list = Array.isArray(data) ? data : data.results || [];
      const sorted = list.sort((a, b) => b.id - a.id);

      setPublications(sorted.slice(0, 4));
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const toggleHidden = async (pub) => {
    const token = localStorage.getItem("access");

    const res = await fetch(`${BASE_URL}/api/publications/${pub.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        is_hidden: !pub.is_hidden,
      }),
    });

    if (!res.ok) {
      alert("Update failed ❌");
      return;
    }

    fetchPublications();
  };

  return (
    <section className="relative overflow-hidden py-24 bg-slate-50 dark:bg-[#091728]">
      <div className="absolute inset-0 opacity-30">
        <div
          className="
          absolute inset-0
          bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),
          linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]
          bg-[size:40px_40px]
        "
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            className="
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-full
            bg-[#317873]/10
            text-[#317873]
            font-medium
          "
          >
            <BookOpen size={16} />
            Research & Publications
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-[#091728] dark:text-white">
            Latest Publications
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-slate-500 dark:text-slate-400">
            Scientific papers, journals and research works published by our
            department members.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div
            className="
            absolute
            left-5
            top-0
            bottom-0
            w-[2px]
            bg-gradient-to-b
            from-[#317873]
            via-[#6ee7b7]
            to-transparent
          "
          />

          <div className="space-y-8">
            {publications.map((pub, index) => (
              <motion.div
                key={pub.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                }}
                className="relative pl-16"
              >
                <div
                  className="
                  absolute
                  left-[11px]
                  top-8
                  w-4
                  h-4
                  rounded-full
                  bg-[#317873]
                  shadow-[0_0_20px_rgba(49,120,115,0.8)]
                "
                />

                <div
                  onClick={() => navigate(`/publications/${pub.id}`)}
                  className="
                  group
                  cursor-pointer
                  overflow-hidden
                  rounded-3xl
                  border
                  border-slate-200
                  dark:border-slate-700
                  bg-white/70
                  dark:bg-[#112240]/80
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#317873]
                  hover:shadow-[0_20px_50px_rgba(49,120,115,0.18)]
                "
                >
                  <div className="p-6 md:p-7">
                    <div className="flex items-center justify-between">
                      <div
                        className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        bg-[#317873]/10
                        px-3
                        py-1
                        text-sm
                        font-medium
                        text-[#317873]
                      "
                      >
                        <Calendar size={14} />
                        {pub.year}
                      </div>
                    </div>

                    <h3
                      className="
                      mt-5
                      text-xl
                      md:text-2xl
                      font-bold
                      text-[#091728]
                      dark:text-white
                      transition
                      group-hover:text-[#317873]
                    "
                    >
                      {pub.title}
                    </h3>

                    <div className="mt-5 flex flex-wrap gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/teachers/${pub.teacher_id ?? pub.teacher}`,
                          );
                        }}
                        className="
                        inline-flex
                        items-center
                        gap-2
                        text-slate-600
                        dark:text-slate-300
                        hover:text-[#317873]
                        transition
                      "
                      >
                        <User size={16} />
                        {pub.teacher_name}
                      </button>

                      <div
                        className="
                        inline-flex
                        items-center
                        gap-2
                        text-slate-500
                        dark:text-slate-400
                      "
                      >
                        <BookOpen size={16} />
                        {pub.journal}
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="mt-5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleHidden(pub);
                          }}
                          className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${
                            pub.is_hidden
                              ? "border-green-500 text-green-500 hover:bg-green-500/10"
                              : "border-red-500 text-red-500 hover:bg-red-500/10"
                          }`}
                        >
                          {pub.is_hidden ? "Unhide" : "Hide"}
                        </button>
                      </div>
                    )}

                    <div
                      className="
                      mt-6
                      flex
                      items-center
                      justify-between
                      border-t
                      border-slate-200
                      dark:border-slate-700
                      pt-5
                    "
                    >
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        View Publication Details
                      </span>

                      <ArrowUpRight size={18} className="text-[#317873]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PublicationSection;
