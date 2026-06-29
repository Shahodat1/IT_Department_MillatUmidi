import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BarChart3, Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { API_BASE } from "../../services/adminApi";

const STATISTICS_URL = "/statistics/";

// Agar backend JWT ishlatsa: "Bearer"
// Agar DRF TokenAuthentication ishlatsa: "Token"
const AUTH_SCHEME = "Bearer";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("access") ||
    localStorage.getItem("token") ||
    localStorage.getItem("jwt");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `${AUTH_SCHEME} ${token}`;
  }

  return config;
});

const initialForm = {
  name: "",
  value: "",
  icon: "",
  order: "",
};

export default function StatisticsAdmin() {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingStatistic, setEditingStatistic] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  const normalizeStatistics = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    return [];
  };

  const extractApiError = (err) => {
    const data = err?.response?.data;
    if (!data) return "Something went wrong.";
    if (typeof data === "string") return data;
    if (data.detail) return data.detail;

    const firstKey = Object.keys(data)[0];
    if (firstKey) {
      const value = data[firstKey];
      if (Array.isArray(value)) return value[0];
      if (typeof value === "string") return value;
    }

    return "Something went wrong.";
  };

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(STATISTICS_URL);
      setStatistics(normalizeStatistics(res.data));
    } catch (err) {
      console.error("Error fetching statistics:", err);

      if (err?.response?.status === 401) {
        setError("Token topilmadi yoki noto‘g‘ri. Avval login qiling.");
      } else {
        setError("Failed to load statistics.");
      }

      setStatistics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
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
    setEditingStatistic(null);
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

  const handleEdit = (statistic) => {
    setEditingStatistic(statistic);
    setFormData({
      name: statistic.name ?? "",
      value: statistic.value ?? "",
      icon: statistic.icon ?? "",
      order: statistic.order ?? "",
    });
    setError("");
    setOpenModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("access") ||
        localStorage.getItem("token") ||
        localStorage.getItem("jwt");

      if (!token) {
        setError("Token topilmadi. Avval login qiling.");
        return;
      }

      const payload = {
        name: formData.name.trim(),
        value: Number(formData.value),
        icon: formData.icon.trim(),
        order: Number(formData.order),
      };

      if (editingStatistic) {
        await api.put(`${STATISTICS_URL}${editingStatistic.id}/`, payload);
      } else {
        await api.post(STATISTICS_URL, payload);
      }

      handleCloseModal();
      await fetchStatistics();
    } catch (err) {
      console.error("Statistics save error:", err);

      if (err?.response?.status === 401) {
        setError("Token noto‘g‘ri yoki backend uni qabul qilmadi.");
      } else {
        setError(extractApiError(err));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Statisticni o‘chirmoqchimisiz?");
    if (!confirmDelete) return;

    try {
      await api.delete(`${STATISTICS_URL}${id}/`);
      await fetchStatistics();
    } catch (err) {
      console.error("Delete error:", err);

      if (err?.response?.status === 401) {
        alert("Token noto‘g‘ri yoki backend uni qabul qilmadi.");
      } else {
        alert("Statisticni o‘chirishda xatolik yuz berdi.");
      }
    }
  };

  const hasStatistics = useMemo(() => statistics.length > 0, [statistics]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Statistics
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage statistics data
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Statistic
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
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Icon
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Order
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="inline-flex items-center gap-2 text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : !hasStatistics ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-slate-500 dark:text-slate-400"
                  >
                    No statistics found
                  </td>
                </tr>
              ) : (
                statistics.map((statistic) => (
                  <tr
                    key={statistic.id}
                    className="border-b border-slate-100 dark:border-slate-800"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                          <BarChart3 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {statistic.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">
                      {statistic.value}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">
                      {statistic.icon || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">
                      {statistic.order}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(statistic)}
                          className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(statistic.id)}
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
                {editingStatistic ? "Edit Statistic" : "Add Statistic"}
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
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Value
                </label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Icon
                </label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="fa-users"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingStatistic ? "Update Statistic" : "Create Statistic"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
