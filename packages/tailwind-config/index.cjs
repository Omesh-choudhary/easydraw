// packages/tailwind-config/index.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // adjust paths for all apps using this config:
    "../../apps/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6366F1",
          dark: "#4F46E5"
        }
      }
    }
  },
  plugins: []
};
