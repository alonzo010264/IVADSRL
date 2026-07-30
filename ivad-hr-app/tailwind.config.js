/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ivad-blue': '#1e293b', // Primary dark blue
        'ivad-gold': '#bfa687', // Secondary gold
      }
    },
  },
  plugins: [],
}
