const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const assert = require("assert");

const server = spawn("go", ["run", "server.go"], {
  stdio: "ignore",
  env: { ...process.env, PORT: "3100" },
});

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function testProductsEndpoint() {
  await wait(2000);
  const products = await new Promise((resolve, reject) => {
    http
      .get("http://localhost:3100/products", (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
        });
      })
      .on("error", reject);
  });
  assert(Array.isArray(products), "Products response not array");
  assert(products.includes("example"), "Example product missing from list");
}

async function testSnapshotsEndpoint() {
  const snapshots = await new Promise((resolve, reject) => {
    http
      .get("http://localhost:3100/snapshots", (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
        });
      })
      .on("error", reject);
  });
  assert(Array.isArray(snapshots), "Snapshots response not array");
  assert(snapshots.includes("example"), "Example snapshot missing from list");
}

async function testGenerateSnapshotEndpoint() {
  const data = JSON.stringify({ snapshot: "example" });
  const result = await new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: 3100,
        path: "/generate-snapshot",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch (err) {
            reject(err);
          }
        });
      },
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
  assert(/generated/i.test(result.message), "Snapshot generation failed");
  assert(fs.existsSync("snapshot-slides.md"), "snapshot-slides.md not created");
}

(async () => {
  try {
    await testProductsEndpoint();
    await testSnapshotsEndpoint();
    await testGenerateSnapshotEndpoint();
    console.log("Server tests passed");
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    server.kill();
  }
})();
