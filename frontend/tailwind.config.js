/** @type {import('tailwindcss').Config} */
import flowbitePlugin from 'flowbite/plugin';
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbitePlugin],
}

