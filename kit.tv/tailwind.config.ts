// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Important: tells Tailwind where to look
  ],
  theme: {
    extend: {
      colors: {
        primary: '#bb793e',         // Custom primary orange
        secondary: '#774822',       // Custom secondary brown
        accent: '#9f5f28',          // Custom accent color
        text: '#f7f2ed',            // Light text color
        background: '#0b0804',      // Dark background color
      },
    },
  },
  plugins: [],
}
export default config
