import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        slate: {
          950: "#070B14",
          900: "#0C1322",
          850: "#111B30",
          800: "#1A2845",
          750: "#22355A",
          700: "#2D4370",
        },
        navy: {
          950: "#070B14",
          900: "#0C1322",
          850: "#111B30",
          800: "#1A2845",
          700: "#283C66",
        },
        brand: {
          cyan: "#0EA5E9",
          blue: "#3B82F6",
          indigo: "#6366F1",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
        },
        sports: {
          green: "#0EA5E9", // Default primary to modern electric cyan/blue
          "green-hover": "#0284C7",
          "green-light": "#38BDF8",
          emerald: "#10B981",
          cyan: "#0EA5E9",
          blue: "#3B82F6",
          amber: "#F59E0B",
          rose: "#F43F5E",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Inter",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
