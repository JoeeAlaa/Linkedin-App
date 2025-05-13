/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
     
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0f172a',
      },
      boxShadow: {
        'dark-glow': '0 0 20px 4px rgba(59, 130, 246, 0.3)', // ظل أزرق ناعم
      },
      keyframes: {
        'fade-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'darkPulse': {
          '0%, 100%': { backgroundColor: '#0f172a' },
          '50%': { backgroundColor: '#1e293b' },
        },
      },
      animation: {
        'fade-down': 'fade-down 0.5s ease-out',
        'fade-up': 'fade-up 0.5s ease-out',
        'dark-pulse': 'darkPulse 4s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('flowbite/plugin') 
  ]
}