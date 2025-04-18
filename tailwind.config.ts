import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        // Steampunk theme colors
        brass: {
          light: '#f5d78e',
          DEFAULT: '#d6a757',
          dark: '#b78d3f'
        },
        copper: {
          light: '#e7a77c',
          DEFAULT: '#c87f51',
          dark: '#a6623d'
        },
        steam: {
          light: '#f2f7fa',
          DEFAULT: '#dbe9f1',
          dark: '#b3cce0'
        },
        aether: {
          light: '#d8c2f2',
          DEFAULT: '#a67de8',
          dark: '#7d55b8'
        },
        sky: {
          light: '#c4e0f9',
          DEFAULT: '#89c4f4',
          dark: '#5da5e8'
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'sky-gradient': 'linear-gradient(180deg, #89c4f4 0%, #5da5e8 100%)',
        'brass-gradient': 'linear-gradient(135deg, #d6a757 0%, #b78d3f 100%)',
      },
      boxShadow: {
        'soft-glow': '0 0 15px rgba(0, 0, 255, 0.2)',
        'accent-glow': '0 0 20px rgba(128, 0, 128, 0.3)',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'subtle-pulse': 'pulse 3s ease-in-out infinite',
        'steam-rise': 'steam-rise 3s ease-out infinite'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        'steam-rise': {
          '0%': { 
            opacity: '0.8',
            transform: 'translateY(0px) scale(1)'
          },
          '100%': { 
            opacity: '0',
            transform: 'translateY(-20px) scale(1.5)'
          }
        },
        'pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
