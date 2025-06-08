# SliDev-At-Scale

This repository contains a starter configuration for building slide decks with [Slidev](https://sli.dev). The goal is to create reusable decks for Vendasta Partners that can be hosted in the Vendasta platform.

## Getting Started

1. Install Node.js (version 16 or later) and Go (1.20 or later).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the slide generator UI:
   ```bash
   npm start
   ```
   The Go server listens at [http://localhost:3000](http://localhost:3000).
4. Start Slidev in development mode manually (optional):
   ```bash
   npm run dev
   ```
   The presentation is served at [http://localhost:3030](http://localhost:3030).
   When using the generator UI, Slidev will be launched for you automatically.
5. Build the slides for production:
   ```bash
   npm run build
   ```
6. Run the test suite:
   ```bash
   npm test
   ```

## Project Structure

- `templates/slide-template.md` – Slide deck template containing variables like `{{title}}`.
- `products/` – JSON files providing content for each product.
- `snapshots/` – JSON files containing Snapshot Report data.
- `slides.md` – Generated deck used by Slidev.
- `snapshot-slides.md` – Generated deck for Snapshot Reports.
- `theme/` – Custom theme files for styling decks.

Run the generator to create `slides.md` for a specific product:

```bash
npm run generate -- <product-name>
```

Generate `snapshot-slides.md` from snapshot data:

```bash
npm run generate-snapshot -- <snapshot-name>
```

## Using the UI

1. Start the server with `npm start` and open the UI at [http://localhost:3000](http://localhost:3000).
2. Click **Generate Slides** and choose a product from the dropdown.
3. Press **Generate** to create `slides.md` for that product. Slidev will start automatically if it is not already running, and a new tab will open at [http://localhost:3030](http://localhost:3030) to display the presentation.
