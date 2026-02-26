module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00d4ff',
          purple: '#a855f7',
          pink: '#ec4899',
          green: '#00ff88',
          orange: '#ff6b00',
        },
        ff: {
          orange: '#f97316',
          gold: '#eab308',
          yellow: '#facc15',
          dark: '#0c0a09',
        },
        dark: {
          950: '#0a0e14',
          900: '#111820',
          800: '#1a2332',
          700: '#1e2a38',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 20px rgba(0, 212, 255, 0.3)',
        'neon-orange': '0 0 20px rgba(255, 107, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
