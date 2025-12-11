/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f9fafb',
        text: '#111827',
        accent: '#6366f1',
        accentGreen: '#14b8a6',
        accentAmber: '#f59e0b',
      },
      boxShadow: {
        glow: '0 10px 40px rgba(99, 102, 241, 0.18)',
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
