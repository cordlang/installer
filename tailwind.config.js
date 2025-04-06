/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
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
        "dark-primary": "var(--color-dark-primary)",
        "dark-secondary": "var(--color-dark-secondary)",
        "dark-tertiary": "var(--color-dark-tertiary)",
        "accent-primary": "var(--color-accent-primary)",
        "accent-secondary": "var(--color-accent-secondary)",
        "light-primary": "var(--color-light-primary)",
        "light-secondary": "var(--color-light-secondary)",
        "light-tertiary": "var(--color-light-tertiary)",
        success: "var(--color-success)",
        error: "var(--color-error)",
        warning: "var(--color-warning)",
        "shape-orange": "var(--color-shape-orange)",
        "shape-blue": "var(--color-shape-blue)",
        "shape-yellow": "var(--color-shape-yellow)",
        "shape-pink": "var(--color-shape-pink)",
        "shape-green": "var(--color-shape-green)",
        "bubble-blue": "var(--color-bubble-blue)",
        "bubble-pink": "var(--color-bubble-pink)",
        "bubble-green": "var(--color-bubble-green)",
        "bubble-yellow": "var(--color-bubble-yellow)",
        "bubble-purple": "var(--color-bubble-purple)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      width: {
        70: "17.5rem",
      },
      borderWidth: {
        3: "3px",
      },
      animation: {
        float: "float 20s infinite ease-in-out",
        "float-shape": "float-shape 25s infinite ease-in-out",
        shine: "shine 1s forwards",
        "pulse-glow": "pulse-glow 2s infinite",
        typing: "typing 3.5s steps(40, end), blink-caret .75s step-end infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) translateX(0) scale(1)" },
          "33%": { transform: "translateY(-30px) translateX(20px) scale(1.05)" },
          "66%": { transform: "translateY(20px) translateX(-15px) scale(0.95)" },
        },
        "float-shape": {
          "0%, 100%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
          "25%": { transform: "translateY(-20px) translateX(15px) rotate(5deg)" },
          "50%": { transform: "translateY(10px) translateX(-15px) rotate(-5deg)" },
          "75%": { transform: "translateY(15px) translateX(10px) rotate(3deg)" },
        },
        shine: {
          to: { transform: "translateX(100%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: 1, boxShadow: "0 0 20px rgba(255, 46, 99, 0.7)" },
          "50%": { opacity: 0.7, boxShadow: "0 0 10px rgba(255, 46, 99, 0.3)" },
        },
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        "blink-caret": {
          "from, to": { borderColor: "transparent" },
          "50%": { borderColor: "var(--color-accent-primary)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

