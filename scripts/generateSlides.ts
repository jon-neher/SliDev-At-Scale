import fs from "fs";
import path from "path";

const productName = process.argv[2];
const templateName = process.argv[3] || "product-overview";
const includeRecent = process.argv[4] === "true";
const includeSelected = process.argv[5] === "true";

if (!productName) {
  console.error(
    "Usage: ts-node scripts/generateSlides.ts <product> [template] [includeRecent] [includeSelected]",
  );
  process.exit(1);
}

const templatePath = path.join(
  __dirname,
  "..",
  "templates",
  `${templateName}.md`,
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
const data: Record<string, string> = JSON.parse(
  fs.readFileSync(productPath, "utf8"),
);

const applyData = (content: string) => {
  let result = content;
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    result = result.replace(regex, value);
  });
  return result;
};

let output = applyData(template);

if (includeRecent) {
  const recentTpl = fs.readFileSync(
    path.join(__dirname, "..", "templates", "recent-activity.md"),
    "utf8",
  );
  output += applyData(recentTpl);
}

if (includeSelected) {
  const selectedTpl = fs.readFileSync(
    path.join(__dirname, "..", "templates", "selected-products.md"),
    "utf8",
  );
  output += applyData(selectedTpl);
}

const destPath = path.join(__dirname, "..", "slides.md");
fs.writeFileSync(destPath, output);
console.log(`Slides generated for ${productName}`);
