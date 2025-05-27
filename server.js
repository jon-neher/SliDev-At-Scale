const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

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
  exec(`node scripts/generateSlides.js ${product}`, (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
      return res.status(500).json({ error: "Failed to generate slides" });
    }
    res.json({ message: stdout.trim() });
  });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
