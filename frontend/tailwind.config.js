/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    container: {
      center: true,
      padding: "1rem",
    },

    extend: {
      colors: {
        button: "#B69B83",
        textcolor: "#091728",
        third: "#7A7A7A",
        fourth: "#54595F",
        bbackground: "#80808012",
        background: "#1A2644",
        body: "#333333",
        bordercolor: "#AAF0D1",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      boxShadow: {
        darkblue:
          "0 10px 15px -3px rgba(26, 38, 68, 0.4), 0 4px 6px -2px rgba(26, 38, 68, 0.3)",
      },
    },
  },

  plugins: [],
};
