import React from "react";

export default function Topbar({
  title,
  subtitle,
  onAdd,
  addLabel = "Add New",
  onLogout,
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-5 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        {onAdd ? (
          <button
            type="button"
            onClick={onAdd}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {addLabel}
          </button>
        ) : null}

        {onLogout ? (
          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Logout
          </button>
        ) : null}
      </div>
    </div>
  );
}
