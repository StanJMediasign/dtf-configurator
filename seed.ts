// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dtf: {
          green: "#22c55e",
          "green-hover": "#16a34a",
          yellow: "#fbbf24",
          "yellow-bg": "#fffbeb",
          border: "#e5e7eb",
          text: "#1f2937",
          muted: "#6b7280",
          bg: "#f9fafb",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
