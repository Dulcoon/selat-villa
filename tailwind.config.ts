import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        selat: {
          charcoal: "#171A18",
          panel: "#202420",
          forest: "#25382F",
          olive: "#656D5D",
          ivory: "#EAE4D8",
          sand: "#C9BBA5",
          bronze: "#A48A63",
          grey: "#A5A69C",
          white: "#F8F6F0",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["var(--font-plus-jakarta)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
