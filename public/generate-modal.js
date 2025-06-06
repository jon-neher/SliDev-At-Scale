class GenerateSlideModal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <button id="open" class="primary-button">Generate Slides</button>
      <div
        id="modal"
        class="fixed inset-0 z-10 hidden items-center justify-center modal-overlay"
      >
        <div class="bg-white rounded-lg w-full max-w-lg p-6 shadow-md">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Generate Slide Deck</h2>
            <button id="close" class="text-gray-500">&times;</button>
          </div>
          <section class="space-y-4">
            <div>
              <h3 class="text-lg font-bold">Select a template</h3>
              <div class="flex gap-3 mt-2">
                <label class="border border-gray-300 rounded-lg px-4 py-2 cursor-pointer">
                  <input
                    type="radio"
                    name="template"
                    value="product-overview"
                    class="sr-only"
                    checked
                  />
                  Product Overview
                </label>
                <label class="border border-gray-300 rounded-lg px-4 py-2 cursor-pointer">
                  <input
                    type="radio"
                    name="template"
                    value="proposal"
                    class="sr-only"
                  />
                  Proposal
                </label>
                <label class="border border-gray-300 rounded-lg px-4 py-2 cursor-pointer">
                  <input
                    type="radio"
                    name="template"
                    value="roi-summary"
                    class="sr-only"
                  />
                  ROI Summary
                </label>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-bold">Include data</h3>
              <label class="flex items-center gap-2 mt-2">
                <input
                  id="recent"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300"
                />
                <span>Recent activity</span>
              </label>
              <label class="flex items-center gap-2 mt-2">
                <input
                  id="selected"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300"
                />
                <span>Selected products</span>
              </label>
            </div>
            <div>
              <h3 class="text-lg font-bold">Select product</h3>
              <select id="product" class="mt-2 w-full border border-gray-300 rounded-lg p-2"></select>
            </div>
            <div class="flex justify-end">
              <!-- Galaxy primary button: https://galaxy.vendasta.com/components/buttons/ -->
              <button id="generate" class="primary-button">Generate</button>
            </div>
          </section>
        </div>
      </div>
    `;

    const open = this.querySelector("#open");
    const close = this.querySelector("#close");
    const modal = this.querySelector("#modal");

    open.addEventListener("click", () => {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    });

    close.addEventListener("click", () => {
      modal.classList.remove("flex");
      modal.classList.add("hidden");
    });

    this.populateProducts();

    this.querySelector("#generate").addEventListener("click", async () => {
      const product = this.querySelector("#product").value;
      const template = this.querySelector(
        'input[name="template"]:checked',
      ).value;
      const includeRecent = this.querySelector("#recent").checked;
      const includeSelected = this.querySelector("#selected").checked;
      const res = await fetch("/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          template,
          includeRecent,
          includeSelected,
        }),
      });
      if (res.ok) {
        // Open the generated deck in a new tab using Galaxy primary color for button styling
        // Reference: https://galaxy.vendasta.com/foundations/colors/
        window.open("http://localhost:3030", "_blank");
      } else {
        alert("Failed to generate slide deck");
      }
      modal.classList.remove("flex");
      modal.classList.add("hidden");
    });
  }

  async populateProducts() {
    const res = await fetch("/products");
    const products = await res.json();
    const select = this.querySelector("#product");
    products.forEach((p) => {
      const option = document.createElement("option");
      option.value = p;
      option.textContent = p;
      select.appendChild(option);
    });
  }
}

customElements.define("generate-slide-modal", GenerateSlideModal);
