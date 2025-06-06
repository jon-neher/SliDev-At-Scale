const express = require("express");
const { exec, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

let slidevProcess = null;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/snapshots", (req, res) => {
  fs.readdir(path.join(__dirname, "snapshots"), (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to load snapshots" });
    }
    const snapshots = files
      .filter((f) => f.endsWith(".json"))
      .map((f) => path.basename(f, ".json"));
    res.json(snapshots);
  });
});

app.get("/products", (req, res) => {
  fs.readdir(path.join(__dirname, "products"), (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to load products" });
    }
    const products = files
      .filter((f) => f.endsWith(".json"))
      .map((f) => path.basename(f, ".json"));
    res.json(products);
  });
});

app.post("/generate", (req, res) => {
  const product = req.body.product || "example";
  const template = req.body.template || "product-overview";
  const includeRecent = req.body.includeRecent ? "true" : "false";
  const includeSelected = req.body.includeSelected ? "true" : "false";
  exec(
    `node scripts/generateSlides.js ${product} ${template} ${includeRecent} ${includeSelected}`,
    (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        return res.status(500).json({ error: "Failed to generate slides" });
      }
      if (slidevProcess) {
        slidevProcess.kill();
      }
      slidevProcess = spawn("npx", ["slidev", "slides.md"], {
        stdio: "inherit",
      });
      slidevProcess.on("close", () => {
        slidevProcess = null;
      });
      res.json({ message: stdout.trim() });
    },
  );
});

app.post("/generate-snapshot", (req, res) => {
  const snapshot = req.body.snapshot || "example";
  const template = req.body.template || "snapshot-report";
  exec(
    `node scripts/generateSnapshotSlides.js ${snapshot} ${template}`,
    (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        return res.status(500).json({ error: "Failed to generate snapshot" });
      }
      if (slidevProcess) {
        slidevProcess.kill();
      }
      slidevProcess = spawn("npx", ["slidev", "snapshot-slides.md"], {
        stdio: "inherit",
      });
      slidevProcess.on("close", () => {
        slidevProcess = null;
      });
      res.json({ message: stdout.trim() });
    },
  );
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
