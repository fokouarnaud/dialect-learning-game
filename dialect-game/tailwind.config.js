/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Animations pour micro-interactions
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2px)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "scale-out": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        // Animations de loading sophistiquées
        "loading-dots": {
          "0%, 80%, 100%": { transform: "scale(0)", opacity: "0.5" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
        "skeleton-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        // Effet de glow animé
        "glow-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor" 
          },
          "50%": { 
            boxShadow: "0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor" 
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // Animations personnalisées
        "bounce-subtle": "bounce-subtle 2s infinite",
        "scale-in": "scale-in 0.2s ease-out",
        "scale-out": "scale-out 0.2s ease-in",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-in",
        "loading-dots": "loading-dots 1.4s infinite",
        "skeleton-pulse": "skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
      // Effets de glow personnalisés
      dropShadow: {
        'glow-subtle': [
          '0 0 6px rgb(59 130 246 / 0.3)',
          '0 0 12px rgb(59 130 246 / 0.15)'
        ],
        'glow-medium': [
          '0 0 8px rgb(59 130 246 / 0.4)',
          '0 0 16px rgb(59 130 246 / 0.2)',
          '0 0 24px rgb(59 130 246 / 0.1)'
        ],
        'glow-strong': [
          '0 0 10px rgb(59 130 246 / 0.5)',
          '0 0 20px rgb(59 130 246 / 0.3)',
          '0 0 30px rgb(59 130 246 / 0.15)'
        ],
        'glow-success': [
          '0 0 8px rgb(34 197 94 / 0.4)',
          '0 0 16px rgb(34 197 94 / 0.2)'
        ],
        'glow-warning': [
          '0 0 8px rgb(234 179 8 / 0.4)',
          '0 0 16px rgb(234 179 8 / 0.2)'
        ],
        'glow-danger': [
          '0 0 8px rgb(239 68 68 / 0.4)',
          '0 0 16px rgb(239 68 68 / 0.2)'
        ],
      },
      // Espacements fins pour micro-interactions
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
      },
      // Transitions personnalisées
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'colors-transform': 'color, background-color, border-color, text-decoration-color, fill, stroke, transform',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
        '600': '600ms',
        '750': '750ms',
        '900': '900ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-in-quart': 'cubic-bezier(0.5, 0, 0.75, 0)',
        'ease-out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      // Backdrop blur personnalisé
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Plugin personnalisé pour les utilities UX
    function({ addUtilities, addComponents, theme }) {
      addUtilities({
        // Utilities pour les micro-interactions
        '.interact-none': {
          'pointer-events': 'none',
          'user-select': 'none',
        },
        '.interact-auto': {
          'pointer-events': 'auto',
          'user-select': 'auto',
        },
        '.touch-pan-x': {
          'touch-action': 'pan-x',
        },
        '.touch-pan-y': {
          'touch-action': 'pan-y',
        },
        // Smooth scrolling
        '.scroll-smooth': {
          'scroll-behavior': 'smooth',
        },
        // Focus visible amélioré
        '.focus-ring': {
          '&:focus-visible': {
            'outline': '2px solid transparent',
            'outline-offset': '2px',
            'box-shadow': `0 0 0 2px ${theme('colors.background')}, 0 0 0 4px ${theme('colors.ring')}`,
          }
        },
        // Hover scale subtle
        '.hover-lift': {
          'transition': 'transform 0.2s ease-in-out',
          '&:hover': {
            'transform': 'translateY(-1px)',
          }
        },
        '.hover-scale': {
          'transition': 'transform 0.2s ease-in-out',
          '&:hover': {
            'transform': 'scale(1.02)',
          }
        },
      });

      addComponents({
        // Composants pour animations d'entrée
        '.animate-enter': {
          'animation': 'scale-in 0.2s ease-out',
        },
        '.animate-exit': {
          'animation': 'scale-out 0.2s ease-in',
        },
        // Loading states
        '.loading-skeleton': {
          'background': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          'background-size': '200% 100%',
          'animation': 'skeleton-pulse 2s infinite',
        },
        // Glass effect
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
      });
    }
  ],
}
