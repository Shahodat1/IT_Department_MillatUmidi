import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  ChevronDown,
  Search,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [dark, setDark] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [query, setQuery] = useState("");

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const admin = user?.is_staff || user?.role === "admin";
  const teacher = user?.role === "teacher" || user?.teacher_id;

  useEffect(() => {
    const pref = localStorage.getItem("ap-theme");

    if (pref === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDark(false);
    }
  }, []);

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("ap-theme", isDark ? "dark" : "light");
    setDark(isDark);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const value = query.trim();
    if (!value) return;

    navigate(`/search?search=${encodeURIComponent(value)}`);
    setQuery("");
  };

  const linkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-all duration-200 ${
      isActive
        ? "text-button after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:rounded-full after:bg-button"
        : "text-slate-700 hover:text-button dark:text-slate-200 dark:hover:text-button"
    }`;

  const dropdownLinkClass = ({ isActive }) =>
    `block rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-button/10 text-button"
        : "text-slate-700 hover:bg-slate-100 hover:text-button dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-button"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 shadow-sm backdrop-blur-md transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-950/85">
      <nav className="mx-auto flex max-w-screen-xl items-center justify-between gap-6 px-4 py-4 lg:px-6">
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer whitespace-nowrap text-xl sm:text-2xl font-bold tracking-tight text-button transition-transform duration-200 hover:scale-[1.01]"
        >
          IT Department
        </div>

        <ul className="flex items-center gap-6">
          <li>
            <NavLink to="/" end className={linkClass}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/teachers" className={linkClass}>
              Teachers
            </NavLink>
          </li>

          <li className="relative flex items-center gap-1">
            <NavLink
              to="/courses"
              className={linkClass}
              onClick={() => setOpenDropdown(false)}
            >
              Courses
            </NavLink>

            <button
              type="button"
              onClick={() => setOpenDropdown((prev) => !prev)}
              className="flex items-center text-slate-700 transition-all duration-200 hover:text-button dark:text-slate-200 dark:hover:text-button"
              aria-label="Toggle courses dropdown"
            >
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  openDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown && (
              <ul className="absolute left-0 top-full z-50 mt-3 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                <li>
                  <NavLink
                    to="/events"
                    className={dropdownLinkClass}
                    onClick={() => setOpenDropdown(false)}
                  >
                    Events
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/publications"
                    className={dropdownLinkClass}
                    onClick={() => setOpenDropdown(false)}
                  >
                    Publications
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/certificates"
                    className={dropdownLinkClass}
                    onClick={() => setOpenDropdown(false)}
                  >
                    Certificates
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/research"
                    className={dropdownLinkClass}
                    onClick={() => setOpenDropdown(false)}
                  >
                    Research
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        </ul>

        <div className="flex items-center gap-2 sm:gap-3 font-poppins">
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm transition-all duration-200 focus-within:border-button focus-within:bg-white dark:border-slate-700 dark:bg-slate-900 dark:focus-within:bg-slate-900">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-[150px] bg-transparent text-sm outline-none placeholder:text-slate-400 dark:text-white"
              />
            </div>
          </form>

          <select className="hidden sm:block rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition-all duration-200 hover:border-button dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <option>EN</option>
            <option>UZ</option>
            <option>RU</option>
          </select>

          {!user ? (
            <Link
              to="/login"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-button hover:text-button dark:border-slate-700 dark:text-slate-200 dark:hover:border-button"
            >
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden lg:block text-sm font-medium text-slate-700 dark:text-slate-200">
                {user.username}
              </span>

              {admin && (
                <span className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-300">
                  Admin
                </span>
              )}

              {teacher && !admin && (
                <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-600 dark:bg-green-500/10 dark:text-green-300">
                  Teacher
                </span>
              )}

              {admin && (
                <button
                  onClick={() => navigate("/admin-dashboard")}
                  className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>
              )}

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition-all duration-200 hover:border-red-300 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={toggleDark}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            {dark ? (
              <Sun size={18} className="text-amber-500" />
            ) : (
              <Moon size={18} />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
