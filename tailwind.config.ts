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
        "display-sm": ["3rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        display: ["4rem", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        "display-lg": ["5rem", { lineHeight: "0.98", letterSpacing: "-0.04em" }],
        "display-xl": ["6rem", { lineHeight: "0.96", letterSpacing: "-0.04em" }],
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
        luxe: "var(--shadow-luxe)",
        "luxe-hover": "var(--shadow-luxe-hover)",
        card: "var(--shadow-luxe)",
        "inner-highlight": "inset 0 1px 0 0 rgba(255, 255, 255, 0.06)",
      },
      animation: {
        "pulse-soft": "pulse-soft 5s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "scroll-x": "scroll-x 60s linear infinite",
        "scroll-x-reverse": "scroll-x-reverse 60s linear infinite",
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
        },think
The user is pointing out that the previous response was cut off. I need to complete the `tailwind.config.ts` file and then proceed with the other requested changes (shrinking images/cards and adding the promo section).

Looking at the previous output:
The last block was `tailwind.config.ts` and it ended at `from: { height: "var(--radix-accordion-content-height)" },`.

I will finish that file and then update the components.

Changes needed:
1. Complete `tailwind.config.ts`.
2. Update `src/components/landing/hero-section.tsx`: Increase text sizes, shrink the product card/slider.
3. Update `src/components/landing/product-details.tsx`: Increase text sizes, shrink the image.
4. Update `src/components/landing/premium-gallery.tsx`: Increase text sizes, shrink the gallery container.
5. Create a new `PromoSection` for the "Buy 2 Get 3" image and insert it into `src/app/page.tsx`.
6. Update `src/components/landing/social-proof.tsx`: Increase text sizes, shrink the marquee cards.
7. Update `src/components/landing/faq-section.tsx`: Increase text sizes.
8. Update `src/components/landing/size-chart.tsx`: Increase text sizes.

Let's start by completing the config and then the components."scroll-x": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "scroll-x-reverse": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;