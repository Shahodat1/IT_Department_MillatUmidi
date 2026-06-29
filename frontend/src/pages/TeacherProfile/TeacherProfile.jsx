import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Pencil, Trash2, Plus, Clock3 } from "lucide-react";

import PersonalTab from "./PersonalTab";
import EducationTab from "./EducationTab";
import ResearchTab from "./ResearchTab";
import PublicationsTab from "./PublicationsTab";
import OfficeHourModal from "./OfficeHourModal";
import CoursesTab from "./CoursesTab";

function TeacherProfile() {
  const { id } = useParams();
  const location = useLocation();

  const [teacher, setTeacher] = useState(location.state?.teacher || null);
  const [publications, setPublications] = useState([]);
  const [educations, setEducations] = useState([]);
  const [researchList, setResearchList] = useState([]);
  const [workExperiences, setWorkExperiences] = useState([]);
  const [courses, setCourses] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [honorAwards, setHonorAwards] = useState([]);

  const [isTeacherOwner, setIsTeacherOwner] = useState(false);
  const [activeTab, setActiveTab] = useState("cv");
  const [loading, setLoading] = useState(!location.state?.teacher);
  const [officeHours, setOfficeHours] = useState([]);
  const [showOfficeHourModal, setShowOfficeHourModal] = useState(false);
  const [editingOfficeHour, setEditingOfficeHour] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);

  const [editingCourse, setEditingCourse] = useState(null);

  const token = localStorage.getItem("access");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    if (!teacher) {
      setLoading(true);
    }

    // Teacher
    fetch(`http://127.0.0.1:8000/api/teachers/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setTeacher(data);
        setOfficeHours(data.office_hours || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setTeacher(null);
      });

    fetch(`http://127.0.0.1:8000/api/courses/?teacher=${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("COURSE API =", data);
        setCourses(data.results || data || []);
      })
      .catch(() => setCourses([]));

    // Publications
    fetch(`http://127.0.0.1:8000/api/publications/?teacher=${id}`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setPublications(data.results || data || []);
      })
      .catch(() => setPublications([]));

    // Education
    fetch(`http://127.0.0.1:8000/api/education/?teacher=${id}`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setEducations(data.results || data || []);
      })
      .catch(() => setEducations([]));

    // Research
    fetch(`http://127.0.0.1:8000/api/research/?teacher=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setResearchList(data.results || data || []);
      })
      .catch(() => setResearchList([]));

    // Work Experience
    fetch(`http://127.0.0.1:8000/api/work-experience/?teacher=${id}`)
      .then((res) => res.json())
      .then((data) => {
        const list = data.results || data || [];
        setWorkExperiences(
          list.filter((item) => String(item.teacher) === String(id)),
        );
      })
      .catch(() => setWorkExperiences([]));

    // Timetable
    fetch(`http://127.0.0.1:8000/api/timetable/?teacher=${id}`)
      .then((res) => res.json())
      .then((data) => {
        const list = data.results || data || [];
        setTimetable(
          list.filter((item) => String(item.teacher) === String(id)),
        );
      })
      .catch(() => setTimetable([]));

    // Honor Awards
    fetch(`http://127.0.0.1:8000/api/honor-awards/?teacher=${id}`)
      .then((res) => res.json())
      .then((data) => {
        const list = data.results || data || [];
        setHonorAwards(
          list.filter((item) => String(item.teacher) === String(id)),
        );
      })
      .catch(() => setHonorAwards([]));

    // Owner check
    if (token) {
      fetch("http://127.0.0.1:8000/api/accounts/me/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((user) => {
          console.log("USER:", user);
          console.log("teacher_id:", user.teacher_id);
          console.log("page id:", id);

          if (Number(user.teacher_id) === Number(id)) {
            console.log("OWNER TRUE");
            setIsTeacherOwner(true);
          }
        })
        .catch(() => setIsTeacherOwner(false));
    }
  }, [id]);

  const handleDeleteOfficeHour = async (officeHourId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/office-hours/${officeHourId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      setOfficeHours((prev) => prev.filter((item) => item.id !== officeHourId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete office hour");
    }
  };

  const handleCreateOfficeHour = async (payload) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/office-hours/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Create failed");
      }

      setOfficeHours((prev) => [...prev, data]);

      setShowOfficeHourModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOfficeHour = async (officeHourId, payload) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/office-hours/${officeHourId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Update failed");
      }

      setOfficeHours((prev) =>
        prev.map((item) => (item.id === officeHourId ? data : item)),
      );

      setShowOfficeHourModal(false);
      setEditingOfficeHour(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCourse = async (payload) => {
    try {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          formData.append(key, value);
        }
      });

      const res = await fetch("http://127.0.0.1:8000/api/courses/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data);
        throw new Error("Create failed");
      }

      setCourses((prev) => [...prev, data]);

      setShowCourseModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create course");
    }
  };

  const handleUpdateCourse = async (courseId, payload) => {
    try {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          formData.append(key, value);
        }
      });

      const res = await fetch(
        `http://127.0.0.1:8000/api/courses/${courseId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        console.log(data);
        throw new Error("Update failed");
      }

      setCourses((prev) =>
        prev.map((course) => (course.id === courseId ? data : course)),
      );

      setShowCourseModal(false);
      setEditingCourse(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update course");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    const confirmed = window.confirm("Delete this course?");

    if (!confirmed) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/courses/${courseId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      setCourses((prev) => prev.filter((course) => course.id !== courseId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete course");
    }
  };

  const teacherImage =
    teacher?.photo_url || teacher?.photo || "/images/person1.png";

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  console.log("TeacherProfile render", {
    loading,
    teacher,
  });
  if (!teacher) {
    console.log("NOT FOUND BLOCK IS RUNNING");
    return (
      <div className="p-10 text-center text-red-600">Teacher not found.</div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0B1120]">
      {/* SIDEBAR */}
      <aside className="hidden md:flex md:w-[280px] flex-col border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827]">
        <div className="p-6">
          <img
            src={teacherImage}
            alt={`${teacher.first_name} ${teacher.last_name}`}
            className="w-28 h-28 rounded-full mx-auto object-cover"
          />

          <h2 className="text-center text-lg font-semibold mt-4 text-slate-900 dark:text-white">
            {teacher.first_name} {teacher.last_name}
          </h2>

          <div className="mt-3 flex gap-3">
            {teacher.academic_degree_display && (
              <span className="rounded-full bg-[#317873]/10 px-4 py-2 ml-8 font-normal text-[#317873]">
                {teacher.academic_degree_display}
              </span>
            )}

            <span className="rounded-full bg-slate-100 px-4 py-2">
              {teacher.position}
            </span>
          </div>

          <ul className="space-y-2 text-sm mt-6 text-slate-700 dark:text-slate-300">
            <li>📧 {teacher.email}</li>
            {teacher.phone && <li>📞 {teacher.phone}</li>}
          </ul>
          {teacher?.office_hours?.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Clock3 size={14} />
                  Office Hours
                </h3>

                {isTeacherOwner && (
                  <button
                    onClick={() => {
                      setEditingOfficeHour(null);
                      setShowOfficeHourModal(true);
                    }}
                    className="
          flex items-center gap-1
          text-[#317873]
          hover:text-[#255c58]
          transition-all
        "
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {officeHours.map((hour) => (
                  <div
                    key={hour.id}
                    className="
          group
          rounded-xl
          border
          border-slate-200
          dark:border-slate-700
          bg-white
          dark:bg-slate-800
          p-3
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-md
        "
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {hour.day.charAt(0).toUpperCase() + hour.day.slice(1)}
                        </p>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          🕒 {hour.start_time?.slice(0, 5)}
                          {" - "}
                          {hour.end_time?.slice(0, 5)}
                        </p>
                      </div>

                      {isTeacherOwner && (
                        <div
                          className="
                flex gap-2
                
              "
                        >
                          <button
                            onClick={() => {
                              setEditingOfficeHour(hour);
                              setShowOfficeHourModal(true);
                            }}
                            className="
                  p-2 rounded-lg
                  hover:bg-blue-100
                  dark:hover:bg-blue-900/30
                "
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => handleDeleteOfficeHour(hour.id)}
                            className="
                  p-2 rounded-lg
                  hover:bg-red-100
                  dark:hover:bg-red-900/30
                "
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1">
        <header className="border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-[#0B1120] z-10">
          <div className="max-w-5xl mx-auto px-4">
            <nav className="flex gap-6 text-sm h-11 items-center overflow-x-auto">
              <button
                onClick={() => setActiveTab("cv")}
                className={
                  activeTab === "cv"
                    ? "font-semibold text-[#317873]"
                    : "text-gray-600  dark:text-gray-300"
                }
              >
                Personal
              </button>
              <button
                onClick={() => setActiveTab("education")}
                className={
                  activeTab === "education"
                    ? "font-semibold text-[#317873]"
                    : "text-gray-600  dark:text-gray-300"
                }
              >
                Education
              </button>
              <button
                onClick={() => setActiveTab("research")}
                className={
                  activeTab === "research"
                    ? "font-semibold text-[#317873]"
                    : "text-gray-600  dark:text-gray-300"
                }
              >
                Research
              </button>
              <button
                onClick={() => setActiveTab("publications")}
                className={
                  activeTab === "publications"
                    ? "font-semibold text-[#317873]"
                    : "text-gray-600  dark:text-gray-300"
                }
              >
                Publications
              </button>
              <button
                onClick={() => setActiveTab("courses")}
                className={
                  activeTab === "courses"
                    ? "font-semibold text-[#317873]"
                    : "text-gray-600 dark:text-gray-300"
                }
              >
                Courses
              </button>
              <button
                onClick={() => setActiveTab("honors")}
                className={
                  activeTab === "honors"
                    ? "font-semibold text-[#317873]"
                    : "text-gray-600  dark:text-gray-300"
                }
              >
                Honors & Awards
              </button>
            </nav>
          </div>
        </header>
        <div className="max-w-5xl mx-auto px-4 pt-10 pb-16 text-slate-900 dark:text-slate-100">
          {activeTab === "cv" && (
            <PersonalTab
              teacher={teacher}
              interestAreas={teacher.interest_areas}
              workExperiences={workExperiences}
              timetable={timetable}
            />
          )}

          {activeTab === "education" && (
            <EducationTab educations={educations} />
          )}

          {activeTab === "research" && (
            <ResearchTab researchList={researchList} />
          )}

          {activeTab === "publications" && (
            <PublicationsTab
              publications={publications}
              teacherId={teacher.id}
              isOwner={isTeacherOwner}
            />
          )}

          {activeTab === "courses" && (
            <CoursesTab
              courses={courses}
              teacherId={teacher.id}
              isOwner={isTeacherOwner}
              onCreate={() => {
                setEditingCourse(null);
                setShowCourseModal(true);
              }}
              onEdit={(course) => {
                setEditingCourse(course);
                setShowCourseModal(true);
              }}
              onDelete={handleDeleteCourse}
            />
          )}

          {activeTab === "honors" && (
            <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-8 border border-[#80808012] dark:border-gray-700">
              <h3 className="text-2xl font-semibold text-[#091728] dark:text-white mb-6 flex items-center gap-3 border-b border-[#B69B83] pb-3">
                <span className="text-[#B69B83]">🏆</span>
                Honors & Awards
              </h3>

              <ul className="space-y-4 text-[#54595F] dark:text-gray-300 leading-relaxed">
                {(honorAwards || []).length > 0 ? (
                  honorAwards.map((item) => (
                    <li
                      key={item.id}
                      className="p-3 rounded-lg border border-[#80808012] dark:border-gray-700 hover:border-[#B69B83] hover:shadow-md transition duration-300"
                    >
                      <span className="text-[#B69B83] pr-3">✔</span>
                      {item.title ||
                        item.name ||
                        item.award_title ||
                        "Honor award"}
                      {item.year ? `, ${item.year}` : ""}
                    </li>
                  ))
                ) : (
                  <>
                    <li className="p-3 rounded-lg border border-[#80808012] dark:border-gray-700">
                      <span className="text-[#B69B83] pr-3">✔</span>
                      No honor awards found yet.
                    </li>
                  </>
                )}
              </ul>
            </section>
          )}
        </div>
      </main>
      {showOfficeHourModal && (
        <OfficeHourModal
          officeHour={editingOfficeHour}
          onClose={() => setShowOfficeHourModal(false)}
          onSave={(payload) => {
            if (editingOfficeHour) {
              handleUpdateOfficeHour(editingOfficeHour.id, payload);
            } else {
              handleCreateOfficeHour(payload);
            }
          }}
        />
      )}
    </div>
  );
}

export default TeacherProfile;
