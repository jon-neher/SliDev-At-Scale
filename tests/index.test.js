const fs = require("fs");
const assert = require("assert");

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const hasSlidev =
  (pkg.dependencies && pkg.dependencies["@slidev/cli"]) ||
  (pkg.devDependencies && pkg.devDependencies["@slidev/cli"]);
assert(hasSlidev, "Slidev CLI dependency missing");

const path = require("path");
const deck = process.env.DECK || "snapshot-report";
const slidesPath = path.join("decks", deck, "slides.template.md");
assert(fs.existsSync(slidesPath), `Slides not found for deck: ${deck}`);
const slides = fs.readFileSync(slidesPath, "utf8");
assert(
  /theme:\s*vendasta/.test(slides),
  "Slides do not specify vendasta theme",
);

const style = fs.readFileSync("theme/vendasta/style.css", "utf8");
assert(
  /--slidev-theme-primary/.test(style),
  "Primary color variable missing in theme",
);

console.log("All tests passed");
