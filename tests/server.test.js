const { spawn } = require("child_process");
const http = require("http");
const assert = require("assert");

const server = spawn("node", ["server.js"], { stdio: "ignore" });

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function testProductsEndpoint() {
  await wait(1000);
  const products = await new Promise((resolve, reject) => {
    http
      .get("http://localhost:3000/products", (res) => {
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

(async () => {
  try {
    await testProductsEndpoint();
    console.log("Server tests passed");
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    server.kill();
  }
})();
