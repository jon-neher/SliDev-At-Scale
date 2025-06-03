const fs = require("fs");
const assert = require("assert");
const vm = require("vm");

(async () => {
  const code = fs.readFileSync("public/generate-snapshot.js", "utf8");

  // minimal DOM stubs
  class MockElement {
    constructor() {
      this.children = [];
      this.eventListeners = {};
      this.classList = { add: () => {}, remove: () => {} };
      this._value = "";
    }
    appendChild(el) {
      this.children.push(el);
    }
    addEventListener(evt, cb) {
      this.eventListeners[evt] = cb;
    }
    querySelector() {
      return null;
    }
    set value(v) {
      this._value = v;
    }
    get value() {
      return this._value;
    }
  }

  class HostElement extends MockElement {
    constructor() {
      super();
      this.elements = {};
    }
    set innerHTML(html) {
      this.html = html;
      const ids = Array.from(html.matchAll(/id="([^"]+)"/g)).map((m) => m[1]);
      ids.forEach((id) => {
        this.elements[id] = new MockElement();
      });
    }
    querySelector(sel) {
      return this.elements[sel.replace("#", "")];
    }
  }

  const fetchCalls = [];
  const sandbox = {
    fetch: async (url, opts) => {
      fetchCalls.push({ url, opts });
      return { ok: true, json: async () => ["example"] };
    },
    window: { open: () => {} },
    document: { createElement: () => new MockElement() },
    customElements: {
      define: (name, ctor) => {
        sandbox.ElementClass = ctor;
      },
    },
    HTMLElement: HostElement,
  };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);

  const modal = new sandbox.ElementClass();
  modal.connectedCallback();
  await modal.populateSnapshots();
  assert(fetchCalls[0].url === "/snapshots", "Snapshots not fetched");
  const select = modal.querySelector("#snapshot");
  assert(
    select.children.length > 0 && select.children[0].value === "example",
    "Snapshot options not populated",
  );

  select.value = "example";
  await modal.querySelector("#generate-snapshot").eventListeners["click"]();
  assert(
    fetchCalls.some((c) => c.url === "/generate-snapshot"),
    "Generate endpoint not called",
  );

  // verify Galaxy class names present in template
  assert(
    /primary-button/.test(modal.html),
    "Galaxy primary-button class missing",
  );

  console.log("generate-snapshot modal tests passed");
})();
