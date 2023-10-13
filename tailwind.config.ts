import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "background-100": "var(--background-100)",
        "background-200": "var(--background-200)",
        "bs-gray-900": "var(--bs-gray-900)",
        "bs-gray-1000": "var(--bs-gray-1000)",
        "bs-gray-alpha-400": "var(--bs-gray-alpha-400)",
        active: "var(--active)",
      },
    },
  },
  plugins: [],
};
export default config;
