/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: ['animate-reveal'],
  theme: {
    extend: {
      animation: {
        'reveal': 'reveal 1s ease-in-out forwards',
      },
      keyframes: {
        reveal: {
          'from': {
            clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)',
            opacity: '0',
            transform: 'translateY(100px)',
          },
          'to': {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}