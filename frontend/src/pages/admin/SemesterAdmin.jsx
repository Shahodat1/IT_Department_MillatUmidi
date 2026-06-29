import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";

const API = "http://127.0.0.1:8000/api/semesters/";

const initialForm = {
  semester_n: "",
  start_date: "",
  end_date: "",
};

export default function SemesterAdmin() {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  const token = localStorage.getItem("access_token"); // yoki "token" bo‘lsa shuni yoz

  const authHeaders = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

  const normalizeSemesters = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    return [];
  };

  const fetchSemesters = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(API, {
        headers: authHeaders,
      });

      setSemesters(normalizeSemesters(res.data));
    } catch (err) {
      console.error("Error fetching semesters:", err);

      if (err?.response?.status === 401) {
        setError("Siz login qilmagansiz. Avval tizimga kiring.");
      } else {
        setError("Semestrlarni yuklashda xatolik yuz berdi.");
      }

      setSemesters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingSemester(null);
    setError("");
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    resetForm();
  };

  const handleEdit = (semester) => {
    setEditingSemester(semester);
    setFormData({
      semester_n: semester.semester_n ?? "",
      start_date: semester.start_date ?? "",
      end_date: semester.end_date ?? "",
    });
    setError("");
    setOpenModal(true);
  };

  const extractApiError = (err) => {
    const data = err?.response?.data;
    if (!data) return "Saqlashda xatolik yuz berdi.";
    if (typeof data === "string") return data;
    if (data.detail) return data.detail;

    const firstKey = Object.keys(data)[0];
    if (firstKey) {
      const value = data[firstKey];
      if (Array.isArray(value)) return value[0];
      if (typeof value === "string") return value;
    }

    return "Saqlashda xatolik yuz berdi.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        semester_n: Number(formData.semester_n),
        start_date: formData.start_date,
        end_date: formData.end_date,
      };

      if (editingSemester) {
        await axios.put(`${API}${editingSemester.id}/`, payload, {
          headers: authHeaders,
        });
      } else {
        await axios.post(API, payload, {
          headers: authHeaders,
        });
      }

      handleCloseModal();
      await fetchSemesters();
    } catch (err) {
      console.error("Semester save error:", err);

      if (err?.response?.status === 401) {
        setError("Siz login qilmagansiz. Avval tizimga kiring.");
      } else {
        setError(extractApiError(err));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Semesterni o‘chirmoqchimisiz?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}${id}/`, {
        headers: authHeaders,
      });

      await fetchSemesters();
    } catch (err) {
      console.error("Delete error:", err);

      if (err?.response?.status === 401) {
        alert("Siz login qilmagansiz. Avval tizimga kiring.");
      } else {
        alert("Semesterni o‘chirishda xatolik yuz berdi");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Semesters
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage university semesters
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Semester
        </button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Semester
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Start Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  End Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="inline-flex items-center gap-2 text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : semesters.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-slate-500 dark:text-slate-400"
                  >
                    No semesters found
                  </td>
                </tr>
              ) : (
                semesters.map((semester) => (
                  <tr
                    key={semester.id}
                    className="border-b border-slate-100 dark:border-slate-800"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                          <CalendarDays className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            Semester {semester.semester_n}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">
                      {semester.start_date}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">
                      {semester.end_date}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(semester)}
                          className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(semester.id)}
                          className="rounded-xl border border-red-200 p-2 text-red-600 transition hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {editingSemester ? "Edit Semester" : "Add Semester"}
              </h2>

              <button
                onClick={handleCloseModal}
                className="rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error ? (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Semester Number
                </label>
                <input
                  type="number"
                  name="semester_n"
                  value={formData.semester_n}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingSemester ? "Update Semester" : "Create Semester"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
