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
        ink: "#1f2937",
        mist: "#263242",
        ember: "#5f7288",
        moss: "#748398",
        slate: "#4d5e73"
      },
      boxShadow: {
        panel: "0 22px 50px rgba(73, 91, 115, 0.14)"
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
