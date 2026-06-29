import { useEffect, useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

function HistorySection() {
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(900);

  useEffect(() => {
    const updateWidth = () => {
      const nextWidth = Math.min(window.innerWidth - 64, 1000);
      setPageWidth(Math.max(nextWidth, 320));
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    fetch("/api/departments/")
      .then((res) => res.json())
      .then((data) => {
        const results = data?.results || data || [];
        setDepartment(results[0] || null);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const pdfUrl = useMemo(() => "/api/departments/history-pdf/", []);

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  if (loading) {
    return (
      <section className="container-custom py-20">
        <p className="text-center text-slate-500 dark:text-slate-300">
          Loading history...
        </p>
      </section>
    );
  }

  if (!department) {
    return (
      <section className="container-custom py-20">
        <p className="text-center text-slate-500 dark:text-slate-300">
          Department not found.
        </p>
      </section>
    );
  }

  return (
    <section className="relative py-20 bg-white dark:bg-[#091728] text-[#317873]">
      <div className="container-custom px-4">
        <div className="text-center">
          <div className="inline-flex items-center rounded-full border border-[#B69B83]/20 bg-[#F8F8F8] dark:bg-white/5 px-5 py-2 text-sm font-medium text-[#8B7355] dark:text-[#AAF0D1] shadow-sm">
            Academic Legacy
          </div>

          <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#091728] dark:text-white">
            Department History
          </h1>

          <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#317873] via-[#AAF0D1] to-transparent" />
        </div>

        {department.history_pdf ? (
          <div className="overflow-x-auto rounded-[32px] border border-slate-200/70 dark:border-white/10 bg-white dark:bg-[#0F172A] shadow-[0_20px_70px_rgba(15,23,42,0.08)] p-4 sm:p-6">
            <div className="mx-auto flex w-full justify-center">
              <Document
                file={pdfUrl}
                onLoadSuccess={onLoadSuccess}
                loading={
                  <div className="py-16 text-center text-slate-500 dark:text-slate-300">
                    Loading PDF...
                  </div>
                }
                error={
                  <div className="py-16 text-center text-red-500">
                    Failed to load PDF file.
                  </div>
                }
              >
                {Array.from(new Array(numPages), (_, index) => (
                  <div key={`page_${index + 1}`} className="mb-6 last:mb-0">
                    <Page
                      pageNumber={index + 1}
                      width={pageWidth}
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                    />
                  </div>
                ))}
              </Document>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white dark:bg-white/5 py-16 text-center shadow-sm">
            <p className="text-slate-500 dark:text-slate-300">
              No history PDF uploaded yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default HistorySection;
