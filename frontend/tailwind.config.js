/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#2563EB',
        success: '#10B981',
        danger: '#EF4444',
        background: '#F9FAFB',
        card: '#FFFFFF',
        text: '#111827',
        secondary: '#6B7280',
        border: '#E5E7EB',
      },
      boxShadow: {
        soft: '0 12px 32px rgba(17, 24, 39, 0.08)',
      },
    },
  },
  plugins: [],
}
