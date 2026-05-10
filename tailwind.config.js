/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-ivory': '#faf6ef',
        'brand-cream': '#f4ede0',
        'brand-sand': '#ddd0b8',
        'brand-gold': '#c8963c',
        'brand-gold-light': '#d4a84e',
        'brand-brown': '#2a1508',
        'brand-espresso': '#1e0e04',
        'brand-muted': '#7a6248',
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'jost': ['Jost', 'sans-serif'],
        'cinzel': ['Cinzel', 'serif'],
      },
      animation: {
        'marquee': 'marquee 20s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
