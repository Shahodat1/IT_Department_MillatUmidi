import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(
    localStorage.getItem("lang") || i18n.language?.toUpperCase() || "EN",
  );

  useEffect(() => {
    const saved = localStorage.getItem("lang") || "EN";
    setLang(saved);
    i18n.changeLanguage(saved.toLowerCase());
    document.documentElement.lang = saved.toLowerCase();
  }, [i18n]);

  const handleChange = (e) => {
    const value = e.target.value;
    setLang(value);
    localStorage.setItem("lang", value);
    i18n.changeLanguage(value.toLowerCase());
    document.documentElement.lang = value.toLowerCase();
  };

  return (
    <select
      value={lang}
      onChange={handleChange}
      className="border px-2 py-1 rounded"
    >
      <option value="EN">EN</option>
      <option value="UZ">UZ</option>
      <option value="RU">RU</option>
    </select>
  );
}

export default LanguageSwitcher;
