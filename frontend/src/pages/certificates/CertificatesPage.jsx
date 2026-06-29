import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CertificateCard from "../../components/certificates/CertificateCard";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function formatDate(dateString) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [search, setSearch] = useState("");
  const [recipientFilter, setRecipientFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);

  const pageSize = 8;
  const totalPages = Math.ceil(count / pageSize);

  useEffect(() => {
    fetchCertificates(currentPage);
  }, [currentPage, search, recipientFilter]);

  const fetchCertificates = async (page = 1) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("access");

      const params = new URLSearchParams();
      params.set("page", page);

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (recipientFilter !== "all") {
        params.set("recipient_type", recipientFilter);
      }

      const response = await fetch(
        `${API_BASE_URL}/api/certificates/?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
        },
      );

      const data = await response.json();

      const results = Array.isArray(data) ? data : data.results || [];
      setCertificates(results);
      setCount(data.count || results.length || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setCurrentPage(1);
    setSearch(e.target.value);
  };

  const handleRecipientChange = (e) => {
    setCurrentPage(1);
    setRecipientFilter(e.target.value);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const recipientOptions = [
    { value: "all", label: "All" },
    { value: "teacher", label: "Teacher" },
    { value: "student", label: "Student" },
    { value: "department", label: "Department" },
  ];

  const renderPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-[#EEF5F5] dark:from-[#081120] dark:via-[#0C1730] dark:to-[#091728]">
      {/* HERO + BREADCRUMB */}
      <section className="px-6 lg:px-16 pt-8">
        <div className="container-custom relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#081120] via-[#10213D] to-[#16335B] px-6 py-10 text-white shadow-[0_25px_80px_rgba(15,23,42,0.18)] lg:px-16 lg:py-14">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#AAF0D1]/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#317873]/10 blur-3xl" />
          </div>

          <nav className="relative mb-5">
            <ol className="flex flex-wrap items-center text-sm sm:text-base font-medium">
              <li>
                <Link
                  to="/"
                  className="text-[#AAF0D1] transition-all duration-200 hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li>
                <span className="mx-2 text-slate-400">›</span>
              </li>
              <li className="text-slate-300">Certificates</li>
            </ol>
          </nav>

          <div className="relative">
            <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
              Certificates
            </h1>

            <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#AAF0D1] via-[#317873] to-transparent" />
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="px-6 lg:px-16 mt-10 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <section className="mb-10 rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-col gap-4 lg:flex-row">
              <input
                type="text"
                placeholder="Search certificates..."
                value={search}
                onChange={handleSearchChange}
                className="h-14 flex-1 rounded-2xl border border-slate-200 bg-white px-5 text-sm outline-none transition focus:border-[#317873] focus:ring-2 focus:ring-[#317873]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />

              <select
                value={recipientFilter}
                onChange={handleRecipientChange}
                className="h-14 min-w-[240px] rounded-2xl border border-slate-200 bg-white px-5 text-sm outline-none transition focus:border-[#317873] focus:ring-2 focus:ring-[#317873]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {recipientOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Stats */}
          <section className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/5">
              <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                Total Certificates
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#091728] dark:text-white">
                {count}
              </h2>
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/5">
              <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                Page Results
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#091728] dark:text-white">
                {certificates.length}
              </h2>
            </div>
          </section>

          {/* Cards */}
          {loading ? (
            <div className="py-20 text-center text-slate-500 dark:text-slate-300">
              Loading certificates...
            </div>
          ) : certificates.length > 0 ? (
            <section className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {certificates.map((certificate) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                  onClick={() => setSelectedCertificate(certificate)}
                />
              ))}
            </section>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-16 text-center text-slate-500 shadow-[0_18px_50px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              No certificates found.
            </div>
          )}

          {/* Pagination */}
          {!loading && count > 0 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Previous
              </button>

              {renderPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`h-11 w-11 rounded-full border text-sm font-medium transition-all duration-200 ${
                    currentPage === page
                      ? "border-[#317873] bg-[#317873] text-white shadow-md shadow-[#317873]/20"
                      : "border-slate-300 bg-white text-slate-700 hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* MODAL */}
      {selectedCertificate && (
        <div
          onClick={() => setSelectedCertificate(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden overflow-y-auto rounded-[32px] border border-slate-200/70 bg-white shadow-2xl dark:border-white/10 dark:bg-[#081120]"
          >
            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-lg transition hover:bg-slate-100 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
            >
              ×
            </button>

            <div className="grid lg:grid-cols-2">
              <div className="min-h-[320px] bg-slate-100 dark:bg-slate-900">
                {selectedCertificate.image_url || selectedCertificate.image ? (
                  <img
                    src={
                      selectedCertificate.image_url || selectedCertificate.image
                    }
                    alt={selectedCertificate.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    No Preview
                  </div>
                )}
              </div>

              <div className="p-8 lg:p-10">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#317873] dark:text-[#AAF0D1]">
                  {selectedCertificate.issuer}
                </p>

                <h2 className="mb-6 text-3xl sm:text-4xl font-bold tracking-tight text-[#091728] dark:text-white leading-tight">
                  {selectedCertificate.title}
                </h2>

                <p className="mb-8 text-sm sm:text-base text-slate-500 dark:text-slate-300">
                  Issued: {formatDate(selectedCertificate.date_issued)}
                </p>

                {selectedCertificate.recipients?.length > 0 && (
                  <div className="mb-10">
                    <h3 className="mb-5 text-lg sm:text-xl font-semibold text-[#091728] dark:text-white">
                      Recipients
                    </h3>

                    <div className="space-y-3">
                      {selectedCertificate.recipients.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between  rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900"
                        >
                          <span className="text-xs sm:text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            {item.recipient_type}
                          </span>

                          <span className="font-semibold text-[#091728] dark:text-white">
                            {item.recipient_name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedCertificate.file_url || selectedCertificate.file) && (
                  <a
                    href={
                      selectedCertificate.file_url || selectedCertificate.file
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-[#317873] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#245c58] dark:bg-[#AAF0D1] dark:text-[#081120] dark:hover:bg-[#8ce9c2]"
                  >
                    Open Certificate File
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
