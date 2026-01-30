/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.html",
    "./**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#3B82F6",   // azul principal MatchFlow
          hover: "#2563EB",
          light: "#60A5FA"
        },
        background: {
          app: "#0F172A",       // fondo general
          sidebar: "#111827",   // sidebar
          card: "#1E293B",      // tarjetas
          cardHover: "#273449"
        },
        text: {
          primary: "#F8FAFC",
          secondary: "#CBD5E1",
          muted: "#94A3B8"
        },
        status: {
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        card: "0 10px 25px rgba(0,0,0,0.25)"
      },
      borderRadius: {
        xl: "0.75rem",
        '2xl': "1rem"
      }
    },
  },
  plugins: [],
}
