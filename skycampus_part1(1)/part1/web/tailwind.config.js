/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue:  '#1A8FE3',
          gold:  '#F5A623',
          navy:  '#0D1B2A',
        },
        role: {
          admin:      '#1A8FE3',
          accountant: '#10B981',
          teacher:    '#8B5CF6',
          parent:     '#F59E0B',
          student:    '#06B6D4',
          superadmin: '#EF4444',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card:  '12px',
        input: '8px',
        badge: '6px',
      },
      spacing: {
        sidebar:          '260px',
        'sidebar-mini':   '64px',
        topbar:           '64px',
      },
    },
  },
  plugins: [],
}
