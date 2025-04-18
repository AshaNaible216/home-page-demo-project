/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        light: 'var(--color-light)',
        dark: 'var(--color-dark)',
        accent: 'var(--color-accent)',
        glass: 'var(--color-glass)',
      },
      fontFamily: {
        sans: 'var(--font-family)',
        heading: 'var(--heading-font)',
      },
      fontSize: {
        base: 'var(--base-size)',
      },
      scale: {
        'typography': 'var(--scale)',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.1)',
        'glass-dark': 'rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}