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
			fontFamily: {
				'lora': ['Lora', 'serif'],
			},
			colors: {
				'rich_black': {
					DEFAULT: '#0d1b2a',
					100: '#030609',
					200: '#050b11',
					300: '#08111a',
					400: '#0b1622',
					500: '#0d1b2a',
					600: '#234870',
					700: '#3875b6',
					800: '#74a3d4',
					900: '#bad1ea'
				},
				'oxford_blue': {
					DEFAULT: '#1b263b',
					100: '#05080c',
					200: '#0b0f18',
					300: '#101724',
					400: '#161f30',
					500: '#1b263b',
					600: '#364c75',
					700: '#5172af',
					800: '#8ba1ca',
					900: '#c5d0e4'
				},
				'yinmn_blue': {
					DEFAULT: '#415a77',
					100: '#0d1218',
					200: '#1a242f',
					300: '#273647',
					400: '#34485f',
					500: '#415a77',
					600: '#587aa1',
					700: '#819bb9',
					800: '#abbcd1',
					900: '#d5dee8'
				},
				'silver_lake_blue': {
					DEFAULT: '#778da9',
					100: '#161c23',
					200: '#2c3746',
					300: '#425369',
					400: '#586f8d',
					500: '#778da9',
					600: '#91a2ba',
					700: '#acbacb',
					800: '#c8d1dc',
					900: '#e3e8ee'
				},
				'platinum': {
					DEFAULT: '#e0e1dd',
					100: '#2e2f2a',
					200: '#5b5e53',
					300: '#898c7e',
					400: '#b4b6ad',
					500: '#e0e1dd',
					600: '#e5e6e3',
					700: '#ececea',
					800: '#f2f3f1',
					900: '#f9f9f8'
				},
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
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
