import {
  Plus,
  Pencil,
  Trash2,
  User,
  GraduationCap,
  BookOpen,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function CoursesTab({ courses, isOwner, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {isOwner && (
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/teacher/courses/create")}
            className="
              flex items-center gap-2
              px-5 py-3
              rounded-2xl
              bg-[#317873]
              text-white
              font-medium
              shadow-lg
              hover:scale-105
              transition
            "
          >
            <Plus size={18} />
            Add Course
          </button>
        </div>
      )}

      {courses.length > 0 ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                shadow-sm
                hover:shadow-xl
                transition-all
                duration-300
                hover:-translate-y-1

                  dark:bg-[#0F1B3D]
  dark:border-slate-700
  dark:shadow-black/30
              "
            >
              {/* IMAGE */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={course.image_url}
                  alt={course.name}
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />

                <div
                  className="
                    absolute
                    top-4
                    left-4
                    rounded-full
                    bg-[#317873]
                    text-white
                    px-4
                    py-2
                    text-sm
                    font-medium
                  "
                >
                  {course.credits} Credits
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {course.name}
                </h3>

                <p className="mt-1 text-[#317873] font-medium">{course.code}</p>

                <p className="mt-4 text-slate-600 line-clamp-3 dark:text-slate-300">
                  {course.description || "No description provided."}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-[#317873]" />

                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        Teacher
                      </p>

                      <p className="font-medium text-sm dark:text-white">
                        {course.teachers?.[0]?.name || "Not assigned"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <GraduationCap size={18} className="text-[#317873]" />

                    <div>
                      <p className="text-xs text-slate-400">Semester</p>

                      <p className="font-medium text-sm">
                        {course.semester_name || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="
                    mt-6
                    flex
                    items-center
                    justify-between
                    border-t
                    pt-4
                     dark:border-slate-700
                  "
                >
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-300">
                    <BookOpen size={18} />
                    <Link
                      to={`/course_detail/${course.code}`}
                      className="text-sm"
                    >
                      Course details
                    </Link>
                  </div>

                  {isOwner && (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/teacher/courses/${course.id}/edit`)
                        }
                        className="
                          p-3
                          rounded-xl
                          bg-blue-50
                          text-blue-600
                          hover:bg-blue-100
                          transition
                        "
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => onDelete(course.id)}
                        className="
                          p-3
                          rounded-xl
                          bg-red-50
                          text-red-600
                          hover:bg-red-100
                          transition
                        "
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="
            rounded-3xl
            border
            border-dashed
            border-slate-300
            py-20
            text-center
             dark:border-slate-700
  dark:bg-[#0F1B3D]
          "
        >
          <h3 className="text-xl font-semibold text-slate-700  dark:text-white">
            No courses assigned
          </h3>

          <p className="text-slate-500 dark:text-slate-400 mt-2">
            This teacher doesn't have any courses yet.
          </p>
        </div>
      )}
    </div>
  );
}
