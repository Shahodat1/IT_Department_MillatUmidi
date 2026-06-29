import React from "react";

function formatDate(dateString) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function CertificateCard({ certificate, onClick }) {
  const imageUrl = certificate.image_url || certificate.image;
  const fileUrl = certificate.file_url || certificate.file;

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
      <div className="relative h-[240px] overflow-hidden bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={certificate.title}
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
          <div
            className="
              w-full
              h-full
              flex
              items-center
              justify-center
              text-slate-400
              font-semibold
            "
          >
            Certificate
          </div>
        )}

        <div
          className="
            absolute
            top-4
            right-4
            bg-white/90
            backdrop-blur-md
            px-3
            py-1
            rounded-full
            text-xs
            font-medium
            text-slate-700
          "
        >
          {certificate.issuer}
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm text-slate-500 mb-2">
          {formatDate(certificate.date_issued)}
        </p>

        <h3
          className="
            text-xl
            font-bold
            text-slate-800
            leading-snug
            mb-4
            line-clamp-2
          "
        >
          {certificate.title}
        </h3>

        {certificate.recipients?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {certificate.recipients.slice(0, 3).map((item) => (
              <span
                key={item.id}
                className="
                  px-3
                  py-1
                  rounded-full
                  bg-blue-50
                  text-blue-700
                  text-xs
                  font-medium
                "
              >
                {item.recipient_name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Official Certificate</span>

          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="
                text-sm
                font-semibold
                text-blue-600
                hover:text-blue-800
                transition-colors
              "
            >
              Open PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
