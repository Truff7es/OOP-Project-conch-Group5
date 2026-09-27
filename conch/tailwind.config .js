/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      colors: {
        light: {
          bg: '#f9fbfd',
          bar: '#b3cbdf',
          text: '#3d6073',
        },
        dark: {
          bg: '#0d151c',
          bar: '#233443',
          text: '#8fb2cb',
        },
      },
    },
  },
  darkMode: ['selector', '[data-theme="dark"]'],
}