// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Koyu modun 'dark' sınıfı ile etkinleştirileceğini belirtiriz.
  darkMode: 'class', // <<<<<<<<<< BU SATIRI EKLEYİN
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}