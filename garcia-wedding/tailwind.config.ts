import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        salmon: "#E8896A",
        blush: "#F2C4BA",
        rose: "#C05A68",
        periwinkle: "#B8C8E0",
        sage: "#ABBE9C",
        navy: "#1A2744",
        cream: "#E8DFC8",
      },
      fontFamily: {
        script: ["Dancing Script", "cursive"],
        sans: ["Barlow Condensed", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
