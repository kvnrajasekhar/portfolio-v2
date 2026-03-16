export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "black-400": "#1a1a1a",
      },
      fontFamily: {
        edu: ['"Edu NSW ACT Cursive"', "cursive"],
        lob: ["Lobster", "italic"],
        oleo: ["Oleo Script", "cursive"]

      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" }, 
          "100%": { transform: "translateX(-50%)" }
        },
        marqueeReverse: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" }
        }
      },
      animation: {
        marquee: "marquee 18s linear infinite",
        marqueeReverse: "marqueeReverse 18s linear infinite"
      },
    },
  },
  plugins: [],
};