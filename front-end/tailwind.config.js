/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}", // Include all files in the pages folder
    "./src/**/*.{js,jsx,ts,tsx}",       // Optional: Include all other files in src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
