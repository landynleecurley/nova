/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        nova: {
          pink: "#ff2d78",
          violet: "#8b5cf6",
          dark: "#0b0b12",
          panel: "#17171f",
          gray: "#b8bcc8",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
