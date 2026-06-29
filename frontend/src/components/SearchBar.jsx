import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const value = query.trim();
    if (!value) return;

    navigate(`/search?search=${encodeURIComponent(value)}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#317873]"
      />
      <button
        type="submit"
        className="ml-2 rounded-xl bg-[#317873] px-4 py-2 text-white"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;
