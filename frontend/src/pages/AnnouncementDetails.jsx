import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function AnnouncementDetails() {
  const { slug } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://127.0.0.1:8000";

  // Date format
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    fetch(`${BASE_URL}/api/announcements/by-slug/${slug}/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Not found");
        }

        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setData(null);
        setLoading(false);
      });
  }, [slug]);

  // Loading

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background text-gray-600 dark:text-gray-300">
        Loading announcement...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background text-red-400">
        Announcement not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumb */}

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex gap-2">
          <Link to="/" className="hover:text-button">
            Home
          </Link>

          <span>/</span>

          <span>Announcement</span>

          <span>/</span>

          <span className="text-button font-medium">{data.title}</span>
        </div>

        {/* Back */}

        <Link
          to="/"
          className="inline-block mb-8 text-sm text-button hover:underline"
        >
          ← Back to announcements
        </Link>

        {/* CARD */}

        <div className="bg-[#317873]/90 dark:bg-[#317873]/80 border border-[#B69B83]/40 rounded-2xl p-8 shadow-lg">
          {/* IMAGE */}

          {data.image_url && (
            <img
              src={data.image_url}
              alt={data.title}
              className="w-full h-72 object-cover rounded-xl mb-8"
            />
          )}

          {/* TITLE */}

          <h1 className="text-4xl font-bold mb-4 text-[#AAF0D1]">
            {data.title}
          </h1>

          {/* DATE */}

          {data.start_date && (
            <p className="text-gray-200 mb-2">
              📅 {formatDate(data.start_date)}
            </p>
          )}

          {/* LOCATION */}

          {data.location && (
            <p className="text-gray-200 mb-6">📍 {data.location}</p>
          )}

          {/* DESCRIPTION */}

          {data.short_description && (
            <p className="text-lg text-gray-100 mb-6">
              {data.short_description}
            </p>
          )}

          {/* CONTENT */}

          <div className="text-gray-100 leading-relaxed">{data.content}</div>

          {/* REGISTER */}

          {data.telegram_link && (
            <div className="mt-8">
              <a
                href={data.telegram_link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-[#AAF0D1] text-black rounded-lg hover:bg-[#B69B83] transition"
              >
                Register Now
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnnouncementDetails;
