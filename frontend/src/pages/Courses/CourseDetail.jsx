import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  BookOpen,
  FileText,
  Award,
  CalendarDays,
  Target,
  Star,
  ClipboardList,
  Flag,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";

const APP_BASE_URL = "http://127.0.0.1:8000";

function CourseDetail() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(null);

  const normalize = (value) =>
    String(value ?? "")
      .trim()
      .toLowerCase();

  const toArray = (value) => {
    if (Array.isArray(value)) return value;
    if (value && Array.isArray(value.results)) return value.results;
    if (value && typeof value === "object") return [value];
    return [];
  };

  const fetchJson = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }
    return res.json();
  };

  const getCourseCategoryCode = (courseData) => {
    const value =
      courseData?.course_category ??
      courseData?.category ??
      courseData?.category_code ??
      courseData?.categoryCode ??
      courseData?.category_slug ??
      "";

    if (!value) return "";

    if (typeof value === "object") {
      return normalize(value.code ?? value.slug ?? value.name ?? value.id);
    }

    return normalize(value);
  };

  const getCourseTitle = (courseData) =>
    courseData?.name || courseData?.title || "Course";

  const getCourseDescription = (courseData) =>
    courseData?.description || "Course description will appear here.";

  const getCourseImage = (courseData) =>
    courseData?.image_url ||
    courseData?.image ||
    courseData?.thumbnail_url ||
    "/images/illustration.png";

  const getCourseVideo = (courseData) => {
    const url =
      courseData?.video_url ||
      courseData?.youtube_url ||
      courseData?.video ||
      "";

    if (!url) return "";

    if (url.includes("watch?v=")) {
      const id = url.split("watch?v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    return url;
  };

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const courseRes = await fetchJson(
          `${APP_BASE_URL}/api/courses/code/${code}/`,
        );
        const courseData = toArray(courseRes)[0] || courseRes;

        if (ignore) return;
        setCourse(courseData);
      } catch (err) {
        if (!ignore) setError(err?.message || "Could not load course.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, [code]);

  const courseName = getCourseTitle(course);
  const gradingCriteria = course?.grading_criteria || [];

  const totalScore = gradingCriteria.reduce(
    (sum, item) => sum + Number(item.score || 0),
    0,
  );

  const getCriterionIcon = (title = "") => {
    const value = title.toLowerCase();

    if (value.includes("attendance"))
      return <Star size={20} className="text-blue-600" />;

    if (value.includes("midterm"))
      return <BarChart3 size={20} className="text-emerald-600" />;

    if (value.includes("final"))
      return <Flag size={20} className="text-violet-600" />;

    if (value.includes("assignment"))
      return <ClipboardList size={20} className="text-pink-600" />;

    return <Target size={20} className="text-amber-600" />;
  };

  const getCriterionColor = (title = "") => {
    const value = title.toLowerCase();

    if (value.includes("attendance"))
      return {
        icon: "bg-blue-50",
        badge: "bg-blue-100 text-blue-700",
      };

    if (value.includes("midterm"))
      return {
        icon: "bg-emerald-50",
        badge: "bg-emerald-100 text-emerald-700",
      };

    if (value.includes("final"))
      return {
        icon: "bg-violet-50",
        badge: "bg-violet-100 text-violet-700",
      };

    if (value.includes("assignment"))
      return {
        icon: "bg-pink-50",
        badge: "bg-pink-100 text-pink-700",
      };

    return {
      icon: "bg-amber-50",
      badge: "bg-amber-100 text-amber-700",
    };
  };
  const courseDescription = getCourseDescription(course);
  const courseCategoryKey = normalize(
    getCourseCategoryCode(course) || courseName,
  );

  const heroTitle =
    course?.hero_title ||
    `What is ${courseName}? <br /> Definition, Examples, Jobs and More`;

  const pageImage = getCourseImage(course);

  const items = course?.items || [];

  const applications = items.filter((item) => item.item_type === "application");

  const skills = items.filter((item) => item.item_type === "skill");

  const practices = items.filter((item) => item.item_type === "practice");

  console.log("COURSE =", course);
  console.log("ITEMS =", items);

  const resources = items.filter((item) => item.item_type === "resource");

  console.log("RESOURCES =", resources);

  const videos = items.filter((item) => item.item_type === "video");

  const aboutTitle = course?.about_title || "About This Program";

  const aboutDescription = course?.about_description || courseDescription;

  if (loading && !course) return <p className="p-10">Loading...</p>;

  if (error && !course) {
    return (
      <div className="p-10">
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={() => navigate("/courses")}
          className="mt-4 rounded-xl bg-[#192a56] px-5 py-3 text-white"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-800 dark:bg-[#091728] text-[#317873]">
      <div className="bg-[#192a56] text-white py-16 px-6 lg:px-24 text-center relative">
        <div className="absolute left-6 top-6 text-sm text-white/80 flex gap-2">
          <span
            onClick={() => navigate("/")}
            className="cursor-pointer hover:underline"
          >
            Home
          </span>

          <span>›</span>

          <span
            onClick={() => navigate("/courses")}
            className="cursor-pointer hover:underline"
          >
            Courses
          </span>

          <span>›</span>

          <span className="opacity-70">{courseName}</span>
        </div>

        <h1
          className="text-4xl md:text-6xl font-bold leading-tight"
          dangerouslySetInnerHTML={{ __html: heroTitle }}
        />

        <p className="mt-4 text-lg max-w-2xl mx-auto">
          {course?.hero_description ||
            courseDescription ||
            "Course description will appear here."}
        </p>
      </div>

      {aboutDescription && (
        <section className="max-w-8xl mx-auto px-6 py-10">
          <div
            className="
      relative
      overflow-hidden
    "
          >
            {/* Background decoration */}
            <div
              className="
        absolute
        top-0
        right-0
        h-72
        w-72
        rounded-full
        bg-[#317873]/10
        blur-3xl
      "
            />

            <div
              className="
        relative
        grid
        lg:grid-cols-2
        gap-16
        items-center
        p-8
        lg:p-14
      "
            >
              {/* Image */}
              <div className="relative group">
                <div
                  className="
            absolute
            -inset-2
            rounded-[32px]
            bg-gradient-to-r
            from-[#317873]
            to-[#192a56]
            opacity-20
            blur-xl
          "
                />

                <img
                  src={pageImage}
                  alt={courseName}
                  className="
            relative
            w-full
            object-cover
            rounded-[32px]
            shadow-2xl
            transition-all
            duration-500
            group-hover:scale-[1.02]
          "
                />
              </div>

              {/* Content */}
              <div>
                <span className="inline-flex items-center rounded-full border border-[#B69B83]/25 bg-white/70 px-4 py-2 text-xs sm:text-sm font-medium text-[#7A644F] shadow-sm backdrop-blur dark:border-[#AAF0D1]/20 dark:bg-white/5 dark:text-[#AAF0D1]">
                  About Program
                </span>

                <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#091728] dark:text-[#AAF0D1]">
                  {aboutTitle}
                </h2>

                <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-[#317873] via-[#AAF0D1] to-transparent" />

                <p
                  className="
            mt-8
            text-[14px]
            leading-8
            text-slate-600
            dark:text-white
          "
                >
                  {aboutDescription}
                </p>

                <div className="flex flex-wrap gap-4 mt-10">
                  <div
                    className="
      rounded-2xl
      bg-slate-50
      px-5
      py-4
      border
      border-slate-100
      dark:bg-[#317873]/10 text-white
    "
                  >
                    <p className="text-xs uppercase text-slate-400">Course</p>
                    <p className="font-bold text-slate-800 dark:text-white">
                      {courseName}
                    </p>
                  </div>

                  <div
                    className="
      rounded-2xl
      bg-slate-50
      px-5
      py-4
      border
      border-slate-100
      dark:bg-[#317873]/10 text-white
    "
                  >
                    <p className="text-xs uppercase text-slate-400">Credits</p>
                    <p className="font-bold text-slate-800 text-center dark:text-white">
                      {course?.credits}
                    </p>
                  </div>

                  <div
                    className="
      rounded-2xl
      bg-slate-50
      px-5
      py-4
      border
      border-slate-100
      dark:bg-[#317873]/10 text-white
    "
                  >
                    <p className="text-xs uppercase text-slate-400">Semester</p>
                    <p className="font-bold text-slate-800 dark:text-white">
                      {course?.semester_name || `Semester ${course?.semester}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {getCourseVideo(course) && (
        <div className="max-w-4xl mx-auto px-6 pb-12 text-center">
          <h2 className="mt-2 mb-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#091728] dark:text-[#AAF0D1]">
            Quick Introduction
          </h2>

          <div className="rounded-xl overflow-hidden shadow-lg">
            <iframe
              src={getCourseVideo(course)}
              className="w-full h-[450px]"
              title="Course Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8">
          {/* WEEKS */}
          {/* COURSE ROADMAP & GRADING */}
          {(course?.weeks?.length > 0 || gradingCriteria.length > 0) && (
            <div className="max-w-7xl mx-auto px-6 py-24">
              <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8">
                {/* ================= ROADMAP ================= */}
                {course?.weeks?.length > 0 && (
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-10">
                      <ClipboardList className="text-[#317873]" size={34} />

                      <div>
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                          Course Roadmap
                        </h2>

                        <p className="text-slate-500 dark:text-white">
                          Weekly learning structure
                        </p>
                      </div>
                    </div>

                    <div className="relative pl-8">
                      <div
                        className="
        absolute
        left-[18px]
        top-0
        bottom-0
        w-[2px]
        bg-slate-200
      "
                      />

                      {course.weeks.map((week, index) => (
                        <motion.button
                          key={week.id}
                          onClick={() => setSelectedWeek(week)}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.08 }}
                          className="
          relative
          block
          w-full
          text-left
          mb-8
          group
        "
                        >
                          <div
                            className="
            absolute
            -left-[28px]
            top-3
            h-5
            w-5
            rounded-full
            bg-[#317873]
            ring-8
            ring-white
          "
                          />

                          <div
                            className="
            p-6
            transition-all
            duration-300
            hover:border-[#317873]
            hover:shadow-xl
          "
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3
                                  className="text-xl font-bold text-slate-900
                                dark:text-white"
                                >
                                  Week {week.week_number}
                                </h3>

                                <p
                                  className="mt-2 text-slate-500
                                dark:text-white"
                                >
                                  Click to view lecture details
                                </p>
                              </div>

                              <span
                                className="
                text-[#317873]
                dark:text-white
                text-2xl
                transition-transform
                group-hover:translate-x-2
              "
                              >
                                →
                              </span>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ================= GRADING ================= */}
                {gradingCriteria.length > 0 && (
                  <div>
                    <div className="flex items-center gap-4 mb-10">
                      <Target className="text-[#317873]" size={34} />

                      <div>
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                          Assessment
                        </h2>

                        <p className="text-slate-500">Grading breakdown</p>
                      </div>
                    </div>

                    <div
                      className="
      rounded-[32px]
      border
      border-slate-200
      bg-white
      overflow-hidden
      shadow-sm
      dark:bg-[#13263d]
dark:border-[#317873]/30
    "
                    >
                      {gradingCriteria.map((item) => (
                        <div
                          key={item.id}
                          className="
          flex
          items-center
          justify-between
          px-6
          py-5
          border-b
          border-slate-100
          dark:border-slate-700
        "
                        >
                          <span className="font-medium text-slate-700 dark:text-white">
                            {item.title}
                          </span>

                          <span
                            className="
            px-4
            py-2
            rounded-xl
            bg-[#317873]/10
            text-[#317873]
            font-bold
            dark:text-white
            dark:bg-[#317873]/20
dark:text-[#AAF0D1]
          "
                          >
                            {item.score}%
                          </span>
                        </div>
                      ))}

                      <div className="bg-slate-50 dark:bg-slate-700 px-6 py-6">
                        <div className="flex justify-between items-center">
                          <span className="text-3xl font-black text-[#317873] dark:text-[#AAF0D1] ">
                            Total
                          </span>

                          <span className="text-3xl font-black text-[#317873] dark:text-white">
                            {totalScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
      {applications.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-12">
            <p className="inline-flex items-center rounded-full border border-[#B69B83]/25 bg-white/70 px-4 py-2 text-xs sm:text-sm font-medium text-[#7A644F] shadow-sm backdrop-blur dark:border-[#AAF0D1]/20 dark:bg-white/5 dark:text-[#AAF0D1]">
              Industry Tools
            </p>
            <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#091728] dark:text-[#AAF0D1]">
              Applications You'll Use
            </h2>
            <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-[#317873] via-[#AAF0D1] to-transparent" />
            <p className="mt-4 max-w-3xl text-lg text-slate-500 dark:text-white">
              Industry-standard platforms and software used throughout this
              course.
            </p>
          </div>

          <div className="space-y-5">
            {applications.map((item, index) => (
              <motion.a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="
        group
        flex
        items-center
        justify-between
        rounded-[28px]
        border
        border-slate-200
        bg-white
        px-8
        py-6
        transition-all
        duration-300
        hover:border-[#317873]
        hover:shadow-lg
        hover:bg-[#317873]/5
      "
              >
                <div className="flex items-center gap-5">
                  <div
                    className="
            h-14
            w-14
            rounded-2xl
            bg-[#317873]/10
            flex
            items-center
            justify-center
          "
                  >
                    <Target size={22} className="text-[#317873]" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-slate-500">{item.description}</p>
                  </div>
                </div>

                <div
                  className="
          flex
          items-center
          gap-3
          text-[#317873]
          font-semibold
        "
                >
                  Open Tool
                  <span
                    className="
            text-xl
            transition-transform
            duration-300
            group-hover:translate-x-2
          "
                  >
                    →
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </section>
      )}

      {practices.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-14">
            <p className="inline-flex items-center rounded-full border border-[#B69B83]/25 bg-white/70 px-4 py-2 text-xs sm:text-sm font-medium text-[#7A644F] shadow-sm backdrop-blur dark:border-[#AAF0D1]/20 dark:bg-white/5 dark:text-[#AAF0D1]">
              Practical Experience
            </p>

            <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#091728] dark:text-[#AAF0D1]">
              Practice Projects
            </h2>
            <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-[#317873] via-[#AAF0D1] to-transparent" />
          </div>

          <div className="space-y-16">
            {practices.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="group"
              >
                <div className="flex gap-8 items-start">
                  <div
                    className="
            text-6xl
            font-black
            text-slate-200
            leading-none
            select-none
            min-w-[80px]
          "
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="flex-1">
                    <h3
                      className="
              text-3xl
              font-bold
              text-slate-900
              transition-colors
              duration-300
              group-hover:text-[#317873]
            "
                    >
                      {item.title}
                    </h3>

                    <p
                      className="
              mt-4
              text-lg
              leading-relaxed
              text-slate-600
              max-w-3xl
            "
                    >
                      {item.description}
                    </p>

                    <div
                      className="
              mt-8
              h-px
              bg-slate-200
              group-hover:bg-[#317873]
              transition-colors
              duration-300
            "
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-14">
            <p className="inline-flex items-center rounded-full border border-[#B69B83]/25 bg-white/70 px-4 py-2 text-xs sm:text-sm font-medium text-[#7A644F] shadow-sm backdrop-blur dark:border-[#AAF0D1]/20 dark:bg-white/5 dark:text-[#AAF0D1]">
              Learning Outcomes
            </p>

            <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#091728] dark:text-[#AAF0D1]">
              Skills You'll Gain
            </h2>
            <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-[#317873] via-[#AAF0D1] to-transparent" />
          </div>

          <div className="flex flex-wrap gap-4">
            {skills.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -2 }}
                className="
        group
        flex
        items-center
        gap-3
        rounded-full
        border
        border-slate-200
        bg-white
        px-5
        py-3
        shadow-sm
        hover:border-[#317873]
        hover:shadow-md
        transition-all
        duration-300
      "
              >
                <div
                  className="
          h-2.5
          w-2.5
          rounded-full
          bg-[#317873]
        "
                />

                <div>
                  <p className="font-semibold text-slate-800">{item.title}</p>

                  {item.description && (
                    <p className="text-xs text-slate-500">{item.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {course?.jobs?.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="mt-2 mb-6 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#091728] dark:text-[#AAF0D1]">
            Career Opportunities
          </h2>
          <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-[#317873] via-[#AAF0D1] to-transparent" />

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            {course?.jobs?.map((job) => (
              <a
                key={job.id}
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold text-[#317873] mb-2">
                  {job.title}
                </h3>

                <p className="text-sm text-gray-500 break-all">{job.url}</p>
              </a>
            ))}
          </div>
        </div>
      )}

      {course?.resources?.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="mt-2 mb-6 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#091728] dark:text-[#AAF0D1]">
            Educational Requirements
          </h2>
          <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-[#317873] via-[#AAF0D1] to-transparent" />

          <p className="text-gray-700 mb-4 mt-4">
            To master {courseName}, students typically study computer science,
            statistics, and real-world applications.
          </p>

          <ul className="list-disc pl-6 text-[#317873] space-y-2">
            {course?.resources?.map((resource) => (
              <li key={resource.id}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {resource.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {resources.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-8">
            <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#091728] dark:text-[#AAF0D1]">
              Learning Resources
            </h2>
            <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-[#317873] via-[#AAF0D1] to-transparent" />

            <p className="mt-2 text-slate-500 mt-4">
              Useful documentation, tutorials and external references.
            </p>
          </div>

          <div className="space-y-4">
            {resources.map((resource, index) => (
              <motion.a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="
            group
            flex
            items-center
            gap-3
            text-lg
            text-slate-700
            hover:text-[#317873]
            transition-colors
          "
              >
                <span className="h-2 w-2 rounded-full bg-[#317873]" />

                <span
                  className="
              border-b
              border-transparent
              group-hover:border-[#317873]
              transition-all
            "
                >
                  {resource.title}
                </span>
              </motion.a>
            ))}
          </div>
        </section>
      )}
      <AnimatePresence>
        {selectedWeek && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
            onClick={() => setSelectedWeek(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="
          w-full
          max-w-3xl
          rounded-[30px]
          bg-white
          dark:bg-slate-900
          shadow-2xl
          overflow-hidden
        "
            >
              {/* TOP BAR */}
              <div className="relative border-b border-slate-200 dark:border-slate-700 p-6">
                <button
                  onClick={() => setSelectedWeek(null)}
                  className="
              absolute
              right-5
              top-5
              h-10
              w-10
              rounded-full
              bg-slate-100
              dark:bg-slate-800
              flex
              items-center
              justify-center
              hover:rotate-90
              transition-all
              duration-300
            "
                >
                  <X size={18} />
                </button>

                <div className="flex items-center gap-4">
                  <div
                    className="
                h-16
                w-16
                rounded-2xl
                bg-gradient-to-br
                from-[#317873]
                to-[#245C57]
                text-white
                flex
                items-center
                justify-center
                font-bold
                text-xl
                shadow-lg
              "
                  >
                    {selectedWeek.week_number}
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Course Week</p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedWeek.topic}
                    </h2>
                  </div>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-8">
                <div className="flex items-center gap-2 text-[#317873] mb-5">
                  <CalendarDays size={18} />
                  <span className="font-medium">
                    Week {selectedWeek.week_number}
                  </span>
                </div>

                <p className="leading-8 text-slate-600 dark:text-slate-300">
                  {selectedWeek.description}
                </p>

                {selectedWeek.file_url && (
                  <div className="mt-8">
                    <a
                      href={selectedWeek.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="
                  inline-flex
                  items-center
                  gap-2
                  text-[#317873]
                  font-semibold
                  underline
                  underline-offset-4
                  hover:text-[#245C57]
                  transition-colors
                "
                    >
                      <FileText size={18} />
                      Lecture Material (PDF)
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CourseDetail;
