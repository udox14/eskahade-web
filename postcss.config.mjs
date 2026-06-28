// Tailwind v4 is used ONLY by the PSB section (src/app/psb/psb-theme.css imports
// "tailwindcss"). The rest of eskahade-web uses plain CSS; @tailwindcss/postcss
// leaves CSS files that don't import tailwindcss untouched, so adding this plugin
// does not affect the existing site styles.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
