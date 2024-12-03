/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/index.ejs" // Ensure the path is correct
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss'), // Add Tailwind CSS as a plugin
    require('autoprefixer'), // Add Autoprefixer as a plugin
  ],
}/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/index.ejs" // Ensure the path is correct
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss'), // Add Tailwind CSS as a plugin
    require('autoprefixer'), // Add Autoprefixer as a plugin
  ],
}
