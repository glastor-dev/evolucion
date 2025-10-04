/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Vue.js specific colors
        vue: {
          primary: "hsl(var(--vue-primary))",
          secondary: "hsl(var(--vue-secondary))",
          dark: "hsl(var(--vue-dark))",
          light: "hsl(var(--vue-light))",
        },
      },
      backgroundImage: {
        'vue-gradient': 'linear-gradient(135deg, hsl(var(--vue-secondary)) 0%, hsl(var(--vue-primary)) 100%)',
        'vue-gradient-dark': 'linear-gradient(135deg, hsl(var(--vue-dark)) 0%, hsl(var(--vue-secondary)) 100%)',
        'vue-gradient-hero': 'linear-gradient(135deg, hsl(var(--vue-primary)) 0%, hsl(var(--vue-light)) 100%)',
      },
      fontFamily: {
        // Inter as primary font family (Vue.js compatible)
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'], // Default sans-serif
        'inter': ['Inter', 'sans-serif'], // Explicit Inter usage
        // Font hierarchy with Inter
        'display': ['Inter', 'sans-serif'], // For headlines and hero text
        'heading': ['Inter', 'sans-serif'], // For section headings
        'body': ['Inter', 'sans-serif'], // For body text and UI
        'accent': ['Inter', 'sans-serif'], // For special elements and CTAs
        // Fallback specialized fonts (optional)
        'mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
