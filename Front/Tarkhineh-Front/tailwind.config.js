/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2f6b3a",
          dark: "#234f2b",
          light: "#e3efe1",
        },
        ink: {
          DEFAULT: "#2b2b2b", // color-text
          muted: "#6b6b6b", // color-text-muted
          dark: "#1c1c1c", // color-dark
        },
        surface: {
          DEFAULT: "#ffffff",
          soft: "#f7f6f3",
        },
        line: "#e5e3dd", // color-border
      },
      fontFamily: {
        Vazir: ["vazirmatn"],
      },
      borderRadius: {
        sm2: "8px",
        md2: "14px",
        lg2: "16px",
      },
      boxShadow: {
        sm2: "0 2px 8px rgba(0, 0, 0, 0.06)",
        md2: "0 6px 20px rgba(0, 0, 0, 0.08)",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};