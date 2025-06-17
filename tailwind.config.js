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
        'mobile-lg': { 'max': '768px' },
      },
      maxWidth: {
        'mobile': '428px',
        'screen': '100vw',
        'full': '100vw',
      },
      minHeight: {
        'screen-safe': '100vh',
      },
      minWidth: {
        'full': '100vw',
        'screen': '100vw',
      },
      width: {
        'screen': '100vw',
        'full': '100vw',
      },
      height: {
        'screen': '100vh',
      }
    },
  },
  plugins: [],
}