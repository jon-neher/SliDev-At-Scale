const fs = require("fs");
const path = require("path");

const deck = process.argv[2] || process.env.DECK || "snapshot-report";
const template = path.join("decks", deck, "slides.template.md");
const output = path.join("decks", deck, "slides.md");

if (!fs.existsSync(template)) {
  console.error(`Template not found: ${template}`);
  process.exit(1);
}

let content = fs.readFileSync(template, "utf8");
const replacements = {
  "{{company}}": process.env.COMPANY || "Vendasta",
  "{{product}}": process.env.PRODUCT || "Snapshot Report",
};
for (const [key, value] of Object.entries(replacements)) {
  content = content.split(key).join(value);
}
fs.writeFileSync(output, content);
console.log(`Generated ${output}`);
