/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        conceptSkyBlue: "#57D4E2",
        hoverConceptSkyBlue: "#3DB3C2",
        conceptGreen: "#03F6B4",
        hoverConceptGreen: "#029A72",
        conceptGrey: "#BFBFBF",
        naverColor: "#03C75A",
        naverHoverColor: "#02A14B",
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

