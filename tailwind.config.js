/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        'mobile-max': { 'max': '428px' },
      },
      maxWidth: {
        'mobile': '428px',
        'screen': '100vw',
      },
      minHeight: {
        'screen-safe': '100vh',
      },
      width: {
        'screen': '100vw',
      },
      height: {
        'screen': '100vh',
      }
    },
  },
  plugins: [],
}