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
        primary: "#FF0040",
        secondary: "#0052FF",
        accent: "#FFD700",
        dark: "#0A0A0A",
        light: "#F5F5F5",
        gray: "#2A2A2A",
      },
      fontFamily: {
        mono: ["'Courier New'", "monospace"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.8s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(30px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;