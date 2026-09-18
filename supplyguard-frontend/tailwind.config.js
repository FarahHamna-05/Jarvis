/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cherry: {
          DEFAULT: '#801010', // Pure Cherry Red from user image
          deep: '#4E0A0A',    // Deep solid background
          dark: '#5C0D0D',    // Solid base
          card: '#6D0F0F',    // Solid card panel
          cardHover: '#7D1313',
          border: '#9C1A1A',  // Solid crisp border
          bright: '#B51D1D',  // Bright cherry red
        },
        cotton: {
          DEFAULT: '#EDEBDD', // Cotton White from user image
          muted: '#D0CCA8',
          soft: '#FAF8F0',
          dark: '#B5B19A',
        },
        risk: {
          critical: '#EDEBDD', // High contrast Cotton White on cherry
          high: '#F5A623',
          medium: '#F8E71C',
          low: '#EDEBDD',
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
