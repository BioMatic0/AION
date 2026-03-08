import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#10211d",
        mist: "#e8ede8",
        ember: "#b07a4f",
        moss: "#557161",
        slate: "#223530"
      },
      boxShadow: {
        panel: "0 18px 48px rgba(10, 20, 18, 0.12)"
      },
      fontFamily: {
        display: ["\"IBM Plex Serif\"", "Georgia", "serif"],
        body: ["\"IBM Plex Sans\"", "\"Segoe UI\"", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;