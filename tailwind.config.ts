import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        "primary-500": "#5288C1",
        "secondary-500": "#52b440",
        "dark-1": "#0E1621",
        "dark-2": "#17212B",
        "dark-3": "#242F3D",
        "dark-4": "#232E3C",
        "light-1": "#FFFFFF",
        "light-2": "#F1F1F1",
        "gray-1": "#697C89",
        glassmorphism: "rgba(52, 88, 131, 0.2)",
      }
    },
  },
  plugins: [],
}
export default config
