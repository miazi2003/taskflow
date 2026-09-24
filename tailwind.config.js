export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Google Sans"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        canvas: {
          DEFAULT: '#FAF7F2',
          subtle: '#F4EFE6',
          muted: '#EFE9DE',
        },
        surface: {
          white: '#FFFFFF',
          warm: '#F7F2EA',
          card: '#FFFFFF',
          olive: '#8FA866',
          'olive-dark': '#7C9652',
          pink: '#FA709A',
          'pink-dark': '#E65684',
          blue: '#9BB4E8',
          yellow: '#F6D75C',
          slate: '#EEF2F6',
        },
        ink: {
          DEFAULT: '#1B1F1B',
          soft: '#2D322C',
          muted: '#747871',
          faint: '#A0A39C',
          border: '#E8E2D5',
        },
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(35, 32, 24, 0.04), 0 1px 3px 0 rgba(35, 32, 24, 0.03)',
        'soft-md': '0 8px 24px -4px rgba(35, 32, 24, 0.06), 0 2px 6px -1px rgba(35, 32, 24, 0.03)',
        'soft-lg': '0 16px 36px -6px rgba(35, 32, 24, 0.08), 0 4px 12px -2px rgba(35, 32, 24, 0.04)',
      },
    },
  },
  plugins: [],
}
