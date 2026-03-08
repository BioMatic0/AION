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
        ink: "#f3f5f7",
        mist: "#eef2f7",
        ember: "#8d98a8",
        moss: "#93a1b3",
        slate: "#cad1db"
      },
      boxShadow: {
        panel: "0 28px 80px rgba(0, 0, 0, 0.34)"
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
