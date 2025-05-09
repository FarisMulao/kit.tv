// tailwind.config.ts
import type { Config } from 'tailwindcss'
import { withUt } from 'uploadthing/tw'

const config: Config = {
  content: [
    './kit.tv/**/*.{js,ts,jsx,tsx}', // Your project structure
    './app/**/*.{js,ts,jsx,tsx}',    // Next.js app directory
    './components/**/*.{js,ts,jsx,tsx}', // Components directory
    './node_modules/@uploadthing/react/dist/**/*.{js,ts,jsx,tsx}', 
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

export default withUt(config)