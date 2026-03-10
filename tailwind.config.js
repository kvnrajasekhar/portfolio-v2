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
        lob:["Lobster", "italic"],
        oleo:["Oleo Script", "cursive"]
        
      },
    },
  },
  plugins: [],
};