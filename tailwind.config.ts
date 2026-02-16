import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'stardew-bold': ['"Stardew Bold"', 'serif'],
        'stardew-thin': ['"Stardew Thin"', 'serif'],
      },
    },
  },
  plugins: [forms],
} satisfies Config
