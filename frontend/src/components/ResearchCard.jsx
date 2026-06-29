import React from "react";

export default function ResearchCard({ research, onClick }) {
  const imageUrl = research.image_url || research.image;

  const statusColor =
    research.status === "Completed"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-amber-50 text-amber-700";

  return (
    <div
      onClick={onClick}
      className="
        group
         bg-white dark:bg-[#091728] text-[#317873]
        rounded-3xl
        overflow-hidden
        border
        border-slate-200
        shadow-sm
        hover:shadow-2xl
        hover:-translate-y-1
        transition-all
        duration-300
        cursor-pointer
      "
    >
      <div className="relative h-[240px] bg-slate-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={research.project_title}
            className="
              w-full
              h-full
              object-cover
              group-hover:scale-105
              transition-transform
              duration-500
            "
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 font-semibold">
            No Preview
          </div>
        )}

        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
        >
          {research.status}
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm text-slate-500 mb-2">{research.period}</p>

        <h3 className="text-xl font-bold text-slate-800 leading-snug mb-3 line-clamp-2">
          {research.project_title}
        </h3>

        <p className="text-sm text-slate-600 mb-4 line-clamp-3">
          {research.description || "No description available."}
        </p>

        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-blue-700">
            {research.teacher_name}
          </span>

          <span className="text-sm text-slate-400">{research.start_year}</span>
        </div>
      </div>
    </div>
  );
}
