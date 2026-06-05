/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // As per Design_System_Material3.pdf
        surface: {
          primary: '#111827',
          secondary: '#1F2937',
        },
        'primary-button': '#2563EB',
        'error-danger': '#EF4444',
        'success-confirm': '#22C55E',
      }
    },
  },
  plugins: [],
}