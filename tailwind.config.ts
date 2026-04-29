import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.mdx'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        editorial: ['Newsreader', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
      },
      colors: {
        bg: '#ffffff',
        surface: '#fafafa',
        border: '#e5e5e5',
        ink: {
          primary: '#0a0a0a',
          secondary: '#525252',
          tertiary: '#737373'
        },
        accent: '#1a1a1a',
        cat: {
          1: '#1f4e79',
          2: '#c47e3c',
          3: '#5a8c5a',
          4: '#9b3939',
          5: '#6a5a8c',
          6: '#8c7a3c',
          7: '#3c8c8c',
          8: '#595959'
        },
        seq: {
          50: '#f7f7f7',
          100: '#e0e0e0',
          300: '#b0b0b0',
          500: '#707070',
          700: '#404040',
          900: '#1a1a1a'
        },
        positive: '#2d6a2d',
        negative: '#8c2d2d'
      },
      fontSize: {
        kpi: ['2.5rem', { lineHeight: '1.05', fontWeight: '500' }],
        'kpi-lg': ['3.5rem', { lineHeight: '1', fontWeight: '500' }]
      }
    }
  },
  plugins: []
};

export default config;
