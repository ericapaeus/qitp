import type { Config } from "tailwindcss";

const config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx}",
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
  			border: "var(--border)",
  			input: "var(--input)",
  			ring: "var(--ring)",
  			background: "var(--bg-primary)",
  			foreground: "var(--text-primary)",
  			primary: {
  				DEFAULT: "var(--primary)",
  				dark: "var(--primary-dark)",
  				foreground: "var(--primary-foreground)",
  			},
  			secondary: {
  				DEFAULT: "var(--secondary)",
  				foreground: "var(--secondary-foreground)",
  			},
  			destructive: {
  				DEFAULT: "var(--destructive)",
  				foreground: "var(--destructive-foreground)",
  			},
  			muted: {
  				DEFAULT: "var(--muted)",
  				foreground: "var(--muted-foreground)",
  			},
  			accent: {
  				DEFAULT: "var(--accent)",
  				foreground: "var(--accent-foreground)",
  			},
  			popover: {
  				DEFAULT: "var(--popover)",
  				foreground: "var(--popover-foreground)",
  			},
  			card: {
  				DEFAULT: "var(--card)",
  				foreground: "var(--card-foreground)",
  			},
  			success: "var(--success)",
  			warning: "var(--warning)",
  			error: "var(--error)",
  			info: "var(--info)",
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderColor: {
  			DEFAULT: "var(--border)",
  		},
  		backgroundColor: {
  			DEFAULT: "var(--bg-primary)",
  		},
  		textColor: {
  			DEFAULT: "var(--text-primary)",
  		},
  		borderRadius: {
  			lg: "var(--radius-lg)",
  			md: "var(--radius-md)",
  			sm: "var(--radius-sm)",
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
  		},
  		animation: {
  			"accordion-down": "accordion-down 0.2s ease-out",
  			"accordion-up": "accordion-up 0.2s ease-out",
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
