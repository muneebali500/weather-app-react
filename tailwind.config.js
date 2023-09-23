/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      black: "#000000",
      white: "#ffffff",
      primary: "#19202D",
      secondary: "#232B39",
      grey_1: "#8F94AF",
      grey_2: "#7F7F7F",
    },
    fontFamily: {
      poppins: "Poppins, sans-serif",
    },
    extend: {},
  },
  plugins: [],
};
