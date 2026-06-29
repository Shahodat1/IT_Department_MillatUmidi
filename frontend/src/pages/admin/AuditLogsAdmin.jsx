import { useEffect, useState } from "react";
import api from "../../lib/api";

function AuditLogsAdmin() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/audit-logs/");
      const data = res.data;

      setLogs(data.results || data || []);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Audit loglarni yuklashda xatolik bo‘ldi.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const q = search.toLowerCase();
    return (
      String(log.user || "")
        .toLowerCase()
        .includes(q) ||
      String(log.action || "")
        .toLowerCase()
        .includes(q) ||
      String(log.model_name || "")
        .toLowerCase()
        .includes(q) ||
      String(log.object_repr || "")
        .toLowerCase()
        .includes(q) ||
      String(log.message || "")
        .toLowerCase()
        .includes(q)
    );
  });

  return (
    <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Audit Logs
          </h1>
          <p className="text-sm text-slate-500">
            Kim nima o‘zgartirganini ko‘rsatadi.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 dark:bg-slate-800 dark:text-white"
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
        {loading ? (
          <div className="p-6 text-slate-500">Loading...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-6 text-slate-500">Hech qanday log topilmadi.</div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Model
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Object
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Message
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Created At
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  IP
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-900">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                    {log.user || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                    {log.action || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                    {log.model_name || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                    {log.object_repr || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                    {log.message || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                    {log.created_at
                      ? new Date(log.created_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                    {log.ip_address || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AuditLogsAdmin;
