export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        dashboard: {
          bg: "#0B1120",
          card: "#111827",
          "card-hover": "#1a2236",
          border: "#1E293B",
          "border-light": "#2D3A4F",
        },
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans KR", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
