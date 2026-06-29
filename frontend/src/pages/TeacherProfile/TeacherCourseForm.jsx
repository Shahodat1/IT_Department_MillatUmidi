import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";

import { buildPayload, extractItems, request } from "../../services/adminApi";

import { courseFields } from "../../config/courseFields";
import NestedSection from "../../components/shared/NestedSection";

import {
  getNestedFields,
  createEmptyNestedItem,
  sanitizeNestedItems,
  resolveFieldOptions,
} from "../../utils/resourceFormHelpers";

export default function TeacherCourseForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [formValues, setFormValues] = useState({});
  const [relatedData, setRelatedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (name, value) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resolvedFields = useMemo(
    () => resolveFieldOptions(courseFields, relatedData),
    [relatedData],
  );

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);

      const semesters = extractItems(await request("/api/semesters/"));

      setRelatedData({
        semester: semesters.map((item) => ({
          value: item.id,
          label: `Semester ${item.semester_n}`,
        })),
      });

      if (isEdit) {
        const course = await request(`/api/courses/${id}/`);

        setFormValues(course);
      } else {
        const defaults = {};

        courseFields.forEach((field) => {
          if (field.type === "nested_section") {
            defaults[field.name] = [];
          } else if (field.type === "checkbox") {
            defaults[field.name] = false;
          } else {
            defaults[field.name] = "";
          }
        });

        setFormValues(defaults);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const submitValues = {
        ...formValues,
      };

      // Nested sectionlarni tozalash
      courseFields.forEach((field) => {
        if (field.type === "nested_section") {
          submitValues[field.name] = sanitizeNestedItems(
            submitValues[field.name],
            field,
          );
        }
      });

      // grading score ni number qilish
      if (submitValues.grading_criteria) {
        submitValues.grading_criteria = submitValues.grading_criteria.map(
          (item) => ({
            ...(item.id ? { id: Number(item.id) } : {}),
            title: item.title,
            score: Number(item.score),
          }),
        );
      }

      const payload = buildPayload(submitValues, courseFields);

      console.log("SUBMIT VALUES", submitValues);

      if (payload instanceof FormData) {
        console.log("===== FORMDATA =====");
        for (const pair of payload.entries()) {
          console.log(pair[0], pair[1]);
        }
      } else {
        console.log("PAYLOAD", payload);
      }

      const isFormData = payload instanceof FormData;

      if (isEdit) {
        await request(`/api/courses/${id}/`, {
          method: "PATCH",
          data: payload,
          isFormData,
        });
      } else {
        await request("/api/courses/", {
          method: "POST",
          data: payload,
          isFormData,
        });
      }

      navigate(-1);
    } catch (err) {
      console.error(err);
      setError(err.message || "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  function renderField(field) {
    const value = formValues[field.name];

    // TEXTAREA
    if (field.type === "textarea") {
      return (
        <textarea
          rows={field.rows || 4}
          value={value || ""}
          onChange={(e) => handleChange(field.name, e.target.value)}
          className="w-full rounded-xl border border-slate-300 p-3"
        />
      );
    }

    // SELECT
    if (field.type === "select") {
      return (
        <select
          value={value || ""}
          onChange={(e) => handleChange(field.name, e.target.value)}
          className="w-full rounded-xl border border-slate-300 p-3"
        >
          <option value="">Select...</option>

          {(field.options || []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    // FILE
    if (field.type === "file") {
      return (
        <input
          type="file"
          accept={field.accept}
          onChange={(e) =>
            handleChange(field.name, e.target.files?.[0] || null)
          }
          className="w-full"
        />
      );
    }

    if (field.type === "nested_section") {
      return (
        <NestedSection
          field={field}
          value={value || []}
          onChange={(items) => handleChange(field.name, items)}
          getNestedFields={getNestedFields}
          createEmptyNestedItem={createEmptyNestedItem}
        />
      );
    }

    // DEFAULT (text / number / url)
    return (
      <input
        type={field.type || "text"}
        value={value || ""}
        onChange={(e) => handleChange(field.name, e.target.value)}
        className="w-full rounded-xl border border-slate-300 p-3"
      />
    );
  }

  if (loading) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {isEdit ? "Edit Course" : "Create New Course"}
            </h1>

            <p className="mt-2 text-slate-500">
              Fill in the course information below.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-slate-300 px-5 py-3 hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {resolvedFields.map((field) => (
              <div
                key={field.name}
                className={field.fullWidth ? "md:col-span-2" : ""}
              >
                {field.type !== "nested_section" && (
                  <label className="mb-2 block font-medium text-slate-700">
                    {field.label}
                  </label>
                )}

                {renderField(field)}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 border-t pt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-slate-300 px-6 py-3"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#317873] px-8 py-3 font-medium text-white hover:bg-[#285f5b]"
            >
              {submitting
                ? "Saving..."
                : isEdit
                  ? "Update Course"
                  : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
