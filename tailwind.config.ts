
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
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
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
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'spin-slow': 'spin-slow 12s linear infinite',
				'steam-rise': 'steam-rise 3s ease-out infinite'
			},
			backgroundImage: {
				'sky-gradient': 'linear-gradient(180deg, #89c4f4 0%, #f5d78e 100%)',
				'brass-gradient': 'linear-gradient(135deg, #d6a757 0%, #f5d78e 100%)',
				'aether-glow': 'radial-gradient(circle, rgba(166,125,232,0.4) 0%, rgba(166,125,232,0) 70%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
