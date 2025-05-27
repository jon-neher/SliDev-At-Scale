# SliDev-At-Scale

This repository contains a starter configuration for building slide decks with [Slidev](https://sli.dev). The goal is to create reusable decks for Vendasta Partners that can be hosted in the Vendasta platform.

## Getting Started

1. Install Node.js (version 16 or later).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate slides (defaults to `snapshot-report`). You can specify any deck:
   ```bash
   npm run generate -- reputation-management
   npm run generate -- social-marketing
   npm run generate -- local-seo
   npm run generate -- inbox-pro
   # or npm run generate -- snapshot-report
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Build the slides for production:
   ```bash
   npm run build
   ```
6. Run the test suite:
   ```bash
   npm test
   ```

## Project Structure

- `decks/` – Contains subfolders for each deck (e.g. `snapshot-report`,
  `reputation-management`, `social-marketing`, `local-seo`, `inbox-pro`).
- `decks/<name>/slides.template.md` – Template deck with placeholders.
- `decks/<name>/slides.md` – Generated deck after running `npm run generate`.
- `theme/` – Custom theme files for styling decks.

Customize the template files under `decks/` and the files under `theme/` to manage your deck content and styling.
