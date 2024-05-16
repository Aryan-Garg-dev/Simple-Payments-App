/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/Pages/*.jsx",
  ],
  theme: {
    extend: {
      colors: {
        "Gunmetal": "#222831",
        "whiteSmoke": "#F6F5F2"
      },
    }, 
  },
  plugins: [],
}