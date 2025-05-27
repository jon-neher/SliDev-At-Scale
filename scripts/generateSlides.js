const fs = require("fs");
const path = require("path");

const productName = process.argv[2];

if (!productName) {
  console.error("Usage: node scripts/generateSlides.js <product>");
  process.exit(1);
}

const templatePath = path.join(
  __dirname,
  "..",
  "templates",
  "slide-template.md",
);
const productPath = path.join(
  __dirname,
  "..",
  "products",
  `${productName}.json`,
);

if (!fs.existsSync(templatePath)) {
  console.error("Template file missing");
  process.exit(1);
}
if (!fs.existsSync(productPath)) {
  console.error(`Product file not found: ${productName}`);
  process.exit(1);
}

const template = fs.readFileSync(templatePath, "utf8");
const data = JSON.parse(fs.readFileSync(productPath, "utf8"));
let output = template;

Object.entries(data).forEach(([key, value]) => {
  const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
  output = output.replace(regex, value);
});

const destPath = path.join(__dirname, "..", "slides.md");
fs.writeFileSync(destPath, output);
console.log(`Slides generated for ${productName}`);
