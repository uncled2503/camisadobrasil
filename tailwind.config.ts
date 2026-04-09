import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          bright: "hsl(var(--gold-bright))",
          muted: "hsl(var(--gold-muted))",
          deep: "hsl(var(--gold-deep))",
        },
        navy: {
          DEFAULT: "hsl(var(--navy))",
          deep: "hsl(var(--navy-deep))",
        },
        pitch: "hsl(var(--pitch-green))",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-sm": ["2.75rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        display: ["3.5rem", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        "display-lg": ["4.25rem", { lineHeight: "0.98", letterSpacing: "-0.04em" }],
        "display-xl": ["5rem", { lineHeight: "0.96", letterSpacing: "-0.04em" }],
      },
      backgroundImage: {
        "gold-radial":
          "radial-gradient(ellipse 90% 55% at 50% -15%, rgba(196, 169, 122, 0.09), transparent 65%)",
        "hero-ambient":
          "radial-gradient(ellipse 120% 90% at 85% 15%, rgba(25, 38, 58, 0.85), hsl(var(--navy-deep)) 55%), radial-gradient(ellipse 80% 60% at 10% 90%, rgba(45, 38, 28, 0.5), transparent 55%)",
        "hero-vignette":
          "radial-gradient(ellipse 85% 70% at 50% 50%, transparent 35%, hsl(var(--navy-deep)) 100%)",
        "mesh-gradient":
          "linear-gradient(145deg, hsl(222 40% 6%) 0%, hsl(220 38% 4%) 45%, hsl(218 42% 7%) 100%)",
        "gold-shine":
          "linear-gradient(115deg, hsl(var(--gold-muted)) 0%, hsl(var(--gold)) 38%, hsl(var(--gold-bright)) 52%, hsl(var(--gold)) 68%, hsl(var(--gold-deep)) 100%)",
        "surface-glass":
          "linear-gradient(165deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 45%)",
      },
      boxShadow: {
        gold: "0 0 60px -12px rgba(196, 169, 122, 0.28)",
        "gold-soft": "0 0 100px -30px rgba(196, 169, 122, 0.2)",
        /** Igual a `globals.css` --shadow-luxe (halo dourado + azul do hero) */
        luxe: "var(--shadow-luxe)",
        "luxe-hover": "var(--shadow-luxe-hover)",
        /** Alias para `Dialog` / superfícies tipo card */
        card: "var(--shadow-luxe)",
        "inner-highlight": "inset 0 1px 0 0 rgba(255, 255, 255, 0.06)",
      },
      animation: {
        "pulse-soft": "pulse-soft 5s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.9" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
