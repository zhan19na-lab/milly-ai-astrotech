import type { Config } from "tailwindcss";

const config: Config = {
  // Scan all app/component files for class usage
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Dark mode is always active — no toggle needed
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ── Milly Brand Palette 2025-2026 ──────────────────────────────
        "space-black": "#0D0D11",   // base background, cosmic void
        "deep-indigo": "#151522",   // card/surface layer
        "neon-purple": "#8B5CF6",   // primary accent
        "neon-cyan":   "#06B6D4",   // secondary accent / data highlights
        // Violet used in theme_color (PWA browser chrome)
        "vivid-violet": "#6D28D9",
      },
      boxShadow: {
        // Glassmorphism glow — soft purple halo for floating cards
        "glass-glow": "0 8px 32px 0 rgba(139, 92, 246, 0.15)",
        // Stronger accent glow for CTAs / active states
        "neon-glow":  "0 0 20px 2px rgba(139, 92, 246, 0.35)",
        // Cyan variant for data/chart highlights
        "cyan-glow":  "0 0 20px 2px rgba(6, 182, 212, 0.30)",
      },
      backgroundImage: {
        // Radial nebula gradient reused across hero sections
        "nebula-radial":
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(109,40,217,0.18) 0%, transparent 70%)",
      },
      fontFamily: {
        // System-safe sans stack; swap for a custom font later
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
