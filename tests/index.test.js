const fs = require("fs");
const assert = require("assert");

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
assert(
  (pkg.dependencies && pkg.dependencies["@slidev/cli"]) ||
    (pkg.devDependencies && pkg.devDependencies["@slidev/cli"]),
  "Slidev CLI dependency missing",
);

const { execSync } = require("child_process");
execSync("node scripts/generateSlides.js example");

execSync("node scripts/generateSnapshotSlides.js example");

const slides = fs.readFileSync("slides.md", "utf8");
assert(
  /theme:\s*vendasta/.test(slides),
  "Slides do not specify vendasta theme",
);
assert(
  /Example Product/.test(slides),
  "Slides were not generated with product content",
);

const snapshotSlides = fs.readFileSync("snapshot-slides.md", "utf8");
assert(
  /Snapshot Report/.test(snapshotSlides),
  "Snapshot slides were not generated",
);

const style = fs.readFileSync("theme/vendasta/style.css", "utf8");
assert(
  /--slidev-theme-primary/.test(style),
  "Primary color variable missing in theme",
);

console.log("All tests passed");
