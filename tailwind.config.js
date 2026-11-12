// Nur nötig, wenn neue Tailwind-Klassen im HTML/JS verwendet werden:
//   npm install   (einmalig)
//   npm run build:css
module.exports = {
  content: ["./index.html", "./js/**/*.js"],
  theme: { extend: {} },
  plugins: []
};
