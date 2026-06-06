/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          primary: '#1a1c2e',   // Deep Midnight Navy
          secondary: '#252849', // Soft Midnight Navy (for cards/widgets)
          tertiary: '#32365a',  // Slate Navy (for hover/elements)
        },
        text: {
          primary: '#ffffff',   // Pure White
          secondary: '#b0b3d1', // Muted Lavender-Slate
        },
        border: {
          color: '#3f436e',     // Muted Navy Border
        },
        primary: '#4f46e5',     // Indigo Blue
        success: '#10b981',     // Emerald Green
        danger: '#ef4444',      // Red
        warning: '#f59e0b',     // Amber
        info: '#0ea5e9',        // Sky Blue
      }
    },
  },
  plugins: [],
}