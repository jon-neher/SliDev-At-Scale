const fs = require("fs");
const assert = require("assert");

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
assert(
  pkg.dependencies && pkg.dependencies["@slidev/cli"],
  "Slidev CLI dependency missing",
);

const slides = fs.readFileSync("slides.md", "utf8");
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
