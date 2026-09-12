/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "tertiary": "#62df7d",
        "surface-container-high": "#222a3d",
        "secondary": "#ffb77d",
        "surface-dim": "#0b1326",
        "secondary-container": "#d97707",
        "background": "#0b1326",
        "surface-container-lowest": "#060e20",
        "on-surface-variant": "#bfc7d2",
        "primary": "#93ccff",
        "primary-container": "#3198dc",
        "surface-container-highest": "#2d3449",
        "surface-container-low": "#131b2e",
        "surface-container": "#171f33",
        "surface": "#0b1326",
        "on-surface": "#dae2fd",
        "outline": "#89929b",
        "outline-variant": "#3f4850",
        "error": "#ffb4ab",
        "error-container": "#93000a",
        "tertiary-container": "#1ca64d",
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
