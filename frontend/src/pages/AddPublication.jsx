import { useState } from "react";

function AddPublication() {
  const [formData, setFormData] = useState({
    title: "",
    journal: "",
    year: "",
    description: "",
  });

  const [file, setFile] = useState(null); // 🔥 faqat bitta

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");

    const form = new FormData();
    form.append("title", formData.title);
    form.append("journal", formData.journal);
    form.append("year", formData.year);
    form.append("description", formData.description);

    if (file) form.append("file", file); // 🔥 faqat shu

    const res = await fetch("http://127.0.0.1:8000/api/publications/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      alert(JSON.stringify(data));
      return;
    }

    alert("Created successfully");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add Publication</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Title"
          className="border p-2 w-full"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <input
          placeholder="Journal"
          className="border p-2 w-full"
          value={formData.journal}
          onChange={(e) =>
            setFormData({ ...formData, journal: e.target.value })
          }
        />

        <input
          placeholder="Year"
          className="border p-2 w-full"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="border p-2 w-full"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        {/* 🔥 FAqat BITTA FILE */}
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <button className="bg-[#317873] text-white px-4 py-2 rounded">
          Save Publication
        </button>
      </form>
    </div>
  );
}

export default AddPublication;
