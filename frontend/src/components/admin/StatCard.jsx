export default function StatCard({
  title,
  value,
  subtitle,
  accent = "bg-slate-900",
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
      <div className={`mb-4 h-2 w-16 rounded-full ${accent}`} />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
        {value}
      </h3>
      {subtitle ? (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
