const { minWidth } = require('tailwindcss/defaulttheme');

module.exports = {
  // mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: '#33E68C',
        primaryHover: '#2ec77a'
      },
      zIndex: {
        '-1': '-1'
      },
      maxWidth: {
        'xxs': '15rem'
      },
      minWidth: {
        'xxs': '6.5rem'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
