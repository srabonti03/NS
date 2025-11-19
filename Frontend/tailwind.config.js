/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--accent-color)",
        bg: "var(--bg-color)",
        card: "var(--card-bg)",
        cardHover: "var(--card-hover-bg)",
        btn: "var(--btn-bg)",
        btnHover: "var(--btn-hover-bg)",
        textMain: "var(--text-main)",
        textSubtle: "var(--text-subtle)",
        textFaint: "var(--text-faint)",
        error: "var(--text-error)",
        borderMain: "var(--border-main)",
        borderSubtle: "var(--border-subtle)",
        layoutBg: "var(--layout-bg)",
      },
      fontFamily: {
        heading: "var(--font-heading)",
        body: "var(--font-body)",
      },
      boxShadow: {
        DEFAULT: "var(--shadow-default)",
        hover: "var(--shadow-hover)",
      },
      transitionDuration: {
        DEFAULT: "var(--transition-regular)",
        slower: "var(--transition-slower)",
      },
    },
  },
  plugins: [],
}
