import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#030712',
          900: '#090d16',
          850: '#0d1322',
          800: '#151d30',
          750: '#1e2942',
          700: '#2a3756',
        },
      },
    },
  },
  plugins: [],
};
export default config;
