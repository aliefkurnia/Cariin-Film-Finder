/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'netflix-black': '#141414',
        'netflix-dark': '#181818',
        'netflix-red': '#e50914',
        'netflix-red-hover': '#f40612',
        'netflix-gray': '#808080',
        'netflix-light-gray': '#b3b3b3',
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
