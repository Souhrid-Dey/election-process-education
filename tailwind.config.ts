import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // TODO: Add custom election-themed color palette and design tokens
      colors: {
        // Primary civic/patriotic palette — to be finalised
        civic: {
          blue: "#1B3A6B",
          red: "#B22234",
          white: "#FFFFFF",
          gold: "#D4AF37",
          light: "#F0F4F8",
        },
      },
      fontFamily: {
        // TODO: Add Google Fonts or custom fonts in Phase 2
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
