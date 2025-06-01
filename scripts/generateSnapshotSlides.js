const fs = require("fs");
const path = require("path");

const snapshotName = process.argv[2];
const templateName = process.argv[3] || "snapshot-report";

if (!snapshotName) {
  console.error(
    "Usage: node scripts/generateSnapshotSlides.js <snapshot> [template]",
  );
  process.exit(1);
}

const templatePath = path.join(
  __dirname,
  "..",
  "templates",
  `${templateName}.md`,
);
const snapshotPath = path.join(
  __dirname,
  "..",
  "snapshots",
  `${snapshotName}.json`,
);

if (!fs.existsSync(templatePath)) {
  console.error("Template file missing");
  process.exit(1);
}
if (!fs.existsSync(snapshotPath)) {
  console.error(`Snapshot file not found: ${snapshotName}`);
  process.exit(1);
}

const template = fs.readFileSync(templatePath, "utf8");
const data = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));

const applyData = (content) => {
  let result = content;
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    result = result.replace(regex, value);
  });
  return result;
};

const output = applyData(template);
const destPath = path.join(__dirname, "..", "snapshot-slides.md");
fs.writeFileSync(destPath, output);
console.log(`Snapshot slides generated for ${snapshotName}`);
