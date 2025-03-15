const htmlFileName = "/public/index.html";
const htmlFileValue = `<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document with data!</title>
        <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;


const tailwindConfigFileName = "/tailwind.config.js";
const tailwindConfigValue = `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;

const postcssConfigFileName = "/postcss.config.js";
const postcssConfigValue = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

const indexCssFileName = "/index.css";
const indexCssFileValue = `
@tailwind base;
@tailwind components;
@tailwind utilities;`;

const htmlFile = {
  [htmlFileName]: { code: htmlFileValue },
};
const tailwindConfigFile = {
  [tailwindConfigFileName]: { code: tailwindConfigValue },
};

const postCssFile = {
  [postcssConfigFileName]: { code: postcssConfigValue },
};
const indexCssFile = {
  [indexCssFileName]: { code: indexCssFileValue },
};

const staterCode = {
...tailwindConfigFile,
...indexCssFile,
...htmlFile,
...postCssFile
};


const tailwindCDN = "https://cdn.tailwindcss.com";
export { staterCode,tailwindCDN };
