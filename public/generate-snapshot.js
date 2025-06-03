class GenerateSnapshotModal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <!-- Galaxy primary button style: https://galaxy.vendasta.com/components/buttons/ -->
      <button id="open-snapshot" class="primary-button">Generate Snapshot Deck</button>
      <div id="snapshot-modal" class="fixed inset-0 z-10 hidden items-center justify-center modal-overlay">
        <div class="bg-white rounded-lg w-full max-w-lg p-6 shadow-md">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Generate Snapshot Deck</h2>
            <button id="close-snapshot" class="text-gray-500">&times;</button>
          </div>
          <section class="space-y-4">
            <div>
              <h3 class="text-lg font-bold">Select snapshot</h3>
              <select id="snapshot" class="mt-2 w-full border border-gray-300 rounded-lg p-2"></select>
            </div>
            <div class="flex justify-end">
              <button id="generate-snapshot" class="primary-button">Generate</button>
            </div>
          </section>
        </div>
      </div>
    `;

    const open = this.querySelector("#open-snapshot");
    const close = this.querySelector("#close-snapshot");
    const modal = this.querySelector("#snapshot-modal");

    open.addEventListener("click", () => {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    });

    close.addEventListener("click", () => {
      modal.classList.remove("flex");
      modal.classList.add("hidden");
    });

    this.populateSnapshots();

    this.querySelector("#generate-snapshot").addEventListener(
      "click",
      async () => {
        const snapshot = this.querySelector("#snapshot").value;
        const res = await fetch("/generate-snapshot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ snapshot }),
        });
        if (res.ok) {
          window.open("http://localhost:3030", "_blank");
        } else {
          alert("Failed to generate snapshot deck");
        }
        modal.classList.remove("flex");
        modal.classList.add("hidden");
      },
    );
  }

  async populateSnapshots() {
    const res = await fetch("/snapshots");
    const snapshots = await res.json();
    const select = this.querySelector("#snapshot");
    snapshots.forEach((s) => {
      const option = document.createElement("option");
      option.value = s;
      option.textContent = s;
      select.appendChild(option);
    });
  }
}

customElements.define("generate-snapshot-modal", GenerateSnapshotModal);
