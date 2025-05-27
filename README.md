# SliDev-At-Scale

This repository contains a starter configuration for building slide decks with [Slidev](https://sli.dev). The goal is to create reusable decks for Vendasta Partners that can be hosted in the Vendasta platform.

## Getting Started

1. Install Node.js (version 16 or later).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build the slides for production:
   ```bash
   npm run build
   ```
5. Run the test suite:
   ```bash
   npm test
   ```

## Project Structure

- `templates/slide-template.md` – Slide deck template containing variables like `{{title}}`.
- `products/` – JSON files providing content for each product.
- `slides.md` – Generated deck used by Slidev.
- `theme/` – Custom theme files for styling decks.

Run the generator to create `slides.md` for a specific product:

```bash
npm run generate -- <product-name>
```
