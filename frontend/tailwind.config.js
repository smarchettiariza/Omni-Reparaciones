/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#F4F5F2",
        surface: "#FFFFFF",
        ink: "#1C2321",
        muted: "#6B7570",
        line: "#DADDD9",
        brand: {
          DEFAULT: "#2F6F62",
          dark: "#234F45",
          light: "#E4EEEC",
        },
        copper: {
          DEFAULT: "#C97A2B",
          light: "#F6E7D5",
        },
        danger: {
          DEFAULT: "#B23A34",
          light: "#F6DEDC",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};