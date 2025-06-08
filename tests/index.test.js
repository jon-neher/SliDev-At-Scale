const fs = require("fs");
const assert = require("assert");
const { execSync } = require("child_process");

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
assert(
  (pkg.dependencies && pkg.dependencies["@slidev/cli"]) ||
    (pkg.devDependencies && pkg.devDependencies["@slidev/cli"]),
  "Slidev CLI dependency missing",
);

// generate product deck without optional sections
execSync("npx ts-node scripts/generateSlides.ts example");

// generate snapshot deck
execSync("npx ts-node scripts/generateSnapshotSlides.ts example");

let slides = fs.readFileSync("slides.md", "utf8");
assert(
  /theme:\s*vendasta/.test(slides),
  "Slides do not specify vendasta theme",
);
assert(
  /Example Product/.test(slides),
  "Slides were not generated with product content",
);

// generate product deck with optional Recent Activity and Selected Products slides
execSync(
  "npx ts-node scripts/generateSlides.ts example product-overview true true",
);
slides = fs.readFileSync("slides.md", "utf8");
assert(/Recent Activity/.test(slides), "Recent Activity section missing");
assert(/Selected Products/.test(slides), "Selected Products section missing");

const snapshotSlides = fs.readFileSync("snapshot-slides.md", "utf8");
assert(
  /Snapshot (Report|Roadmap)/.test(snapshotSlides),
  "Snapshot slides were not generated",
);
assert(
  /0-30 Days/.test(snapshotSlides),
  "Phase sections missing in snapshot deck",
);
assert(
  /Key Metrics Dashboard/.test(snapshotSlides),
  "Key metrics section missing",
);

const style = fs.readFileSync("theme/vendasta/style.css", "utf8");
assert(
  /--slidev-theme-primary/.test(style),
  "Primary color variable missing in theme",
);

console.log("All tests passed");
