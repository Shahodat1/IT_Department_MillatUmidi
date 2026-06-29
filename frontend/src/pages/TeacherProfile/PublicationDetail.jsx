import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { motion } from "framer-motion";
import { API_BASE } from "../../services/adminApi";

import {
  ArrowLeft,
  Calendar,
  BookOpen,
  Download,
  Pencil,
  Trash2,
  FileText,
} from "lucide-react";

function PublicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const BASE_URL = API_BASE;

  const [pub, setPub] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    journal: "",
    year: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
  });

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {}

  useEffect(() => {
    fetch(`${BASE_URL}/api/publications/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setPub(data);
        setFormData({
          title: data.title || "",
          journal: data.journal || "",
          year: data.year || "",
          description: data.description || "",
        });
      });
  }, [id]);

  if (!pub) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#091728]">
        <div className="animate-pulse text-[#317873] text-lg">
          Loading publication...
        </div>
      </div>
    );
  }

  console.log("Publication:", pub);
  console.log("Teacher:", pub.teacher);

  const pubTeacherId =
    typeof pub.teacher === "object" ? pub.teacher?.id : pub.teacher;

  const teacherProfilePath = `/teachers/${pubTeacherId}`;

  const goBack = () => {
    pubTeacherId ? navigate(teacherProfilePath) : navigate(-1);
  };

  const userTeacherId = user?.teacher_id;
  const isOwner = userTeacherId === pubTeacherId;

  // DELETE
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This publication will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    const token = localStorage.getItem("access");

    const res = await fetch(`${BASE_URL}/api/publications/${pub.id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.text();
      console.log(error);
      toast.fire({
        icon: "error",
        title: `Delete failed (${res.status})`,
      });
      return;
    }

    toast.fire({
      icon: "success",
      title: "Deleted",
    });

    goBack();
  };

  // UPDATE
  const handleUpdate = async () => {
    const token = localStorage.getItem("access");
    setLoading(true);

    const formDataToSend = new FormData();

    formDataToSend.append("title", formData.title);
    formDataToSend.append("journal", formData.journal);
    formDataToSend.append("year", Number(formData.year));
    formDataToSend.append("description", formData.description);

    if (imageFile) formDataToSend.append("image", imageFile);
    if (pdfFile) formDataToSend.append("file", pdfFile);

    const res = await fetch(`${BASE_URL}/api/publications/${pub.id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formDataToSend,
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.fire({ icon: "error", title: "Update failed" });
      return;
    }

    toast.fire({ icon: "success", title: "Updated!" });

    setIsEditing(false);
    setPub(data);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#091728]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-6 pt-12 text-sm text-gray-500 mb-8 flex gap-2 items-center dark:text-white"
      >
        <span
          onClick={() => navigate("/")}
          className="cursor-pointer hover:underline"
        >
          Home
        </span>
        <span>›</span>
        <span onClick={goBack} className="cursor-pointer hover:underline">
          Teacher Profile
        </span>
        <span>›</span>
        <span className="text-gray-500 font-medium truncate max-w-[200px]">
          {pub.title}
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-6 py-8"
      >
        <div className="overflow-hidden rounded-[32px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#112240] shadow-xl">
          {/* EDIT / DELETE */}
          <div className="flex justify-end p-6">
            {isOwner && (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* IMAGE */}
          {pub.image && (
            <div className="relative">
              <img
                src={
                  pub.image.startsWith("http")
                    ? pub.image
                    : `${BASE_URL}${pub.image}`
                }
                alt={pub.title}
                className="w-full h-[500px] object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
          )}

          {/* INFO */}
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-3 py-1 rounded-full bg-[#317873]/10 text-[#317873] text-sm font-medium">
                Publication
              </span>

              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium">
                {pub.year}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-[#091728] dark:text-white">
              {pub.title}
            </h1>

            <div className="mt-8 flex flex-wrap gap-6 text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <BookOpen size={18} />
                {pub.journal}
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={18} />
                {pub.year}
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="px-8 md:px-12 pb-12">
            <div className="rounded-3xl bg-slate-100 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#317873]/10 flex items-center justify-center">
                  <FileText size={18} className="text-[#317873]" />
                </div>

                <h2 className="text-2xl font-bold text-[#091728] dark:text-white">
                  Abstract
                </h2>
              </div>

              <p className="leading-8 text-slate-700 dark:text-slate-300">
                {pub.description || "No description provided."}
              </p>
            </div>

            {/* PDF */}
            {pub.file && (
              <div className="mt-8 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#112240] p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                  <div>
                    <h3 className="text-xl font-semibold text-[#091728] dark:text-white">
                      Publication File
                    </h3>

                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                      Download or preview the original publication PDF.
                    </p>
                  </div>

                  <a
                    href={
                      pub.file.startsWith("http")
                        ? pub.file
                        : `${BASE_URL}${pub.file}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#317873] text-white font-medium hover:scale-105 transition"
                  >
                    <Download size={20} />
                    Download PDF
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#112240] p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              Edit Publication
            </h2>

            <input
              className="w-full mb-3 p-3 rounded-xl border dark:bg-[#0f172a]"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
            />

            <input
              className="w-full mb-3 p-3 rounded-xl border dark:bg-[#0f172a]"
              value={formData.journal}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  journal: e.target.value,
                })
              }
            />

            <input
              className="w-full mb-3 p-3 rounded-xl border dark:bg-[#0f172a]"
              value={formData.year}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  year: e.target.value,
                })
              }
            />

            <textarea
              rows={6}
              className="w-full mb-4 p-3 rounded-xl border dark:bg-[#0f172a]"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />

            <input
              type="file"
              accept="image/*,application/pdf"
              className="mb-6"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                if (file.type.startsWith("image/")) {
                  setImageFile(file);
                  setPdfFile(null);
                } else if (file.type === "application/pdf") {
                  setPdfFile(file);
                  setImageFile(null);
                }
              }}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2 rounded-xl border"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-[#317873] text-white"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PublicationDetail;
