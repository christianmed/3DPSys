import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tokyo: {
          bg: "#1a1b26",
          surface: "#24283b",
          elevated: "#2f3549",
          border: "#3b4261",
          primary: "#7aa2f7",
          primaryHover: "#89b4fa",
          cyan: "#2ac3de",
          green: "#9ece6a",
          orange: "#ff9e64",
          red: "#f7768e",
          text: "#c0caf5",
          muted: "#9aa5ce",
          faint: "#565f89",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        "card-soft": "0 8px 30px rgba(0, 0, 0, 0.25)",
        "card-glow": "0 0 25px rgba(122, 162, 247, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
