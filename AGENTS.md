# AGENTS.md

## Purpose
This file provides instructions for Codex agents contributing to this repository. It outlines code standards, testing expectations, pull request conventions, and styling references to ensure contributions align with Vendasta's design system and engineering practices.

---

## Code Style

- Use **Prettier** for formatting JavaScript/TypeScript, and **Black** for Python.
- Follow [Vendasta Galaxy](https://galaxy.vendasta.com/) guidelines for all UI-related styles.
- Use semantic and self-descriptive variable and function names.
- Avoid abbreviations and single-letter identifiers (except in iterators).

---

## Styling & Design Reference

Codex agents working with front-end or UI components must adhere to the following rules:

- **All UI components must reflect the Vendasta Galaxy design system**. This includes color tokens, spacing, typography, and component structure.
- When adding or editing components:
  - Reference **specific URLs from [Galaxy](https://galaxy.vendasta.com/)** in code comments when relevant (e.g., when applying tokens or layout logic).
  - Use naming conventions and patterns from Galaxy (e.g., `primary-button`, `surface-neutral-100`, `spacing-4`).
- Match component usage and interaction behavior to Galaxy documentation unless business logic requires deviation.
- When unsure, Codex should **surface a comment linking to the closest Galaxy component** for human review.

---

## Testing

- Run `npm run test` or the relevant project-specific test suite before submitting any PR.
- For UI changes, ensure visual regression tests (if applicable) are updated and reviewed.
- Snapshot tests should reflect Galaxy-compliant output.

---

## PR Instructions

- **Title format**: `[Component] Description of change`
- PR body must include:
  - A one-line summary of the change.
  - A "Testing Done" section (include screenshots or video for UI changes).
  - Links to the corresponding Galaxy design references, if relevant.

---

## File Structure

Codex agents should respect existing module and folder boundaries. If creating new components:

- Follow naming and grouping conventions from `/components` or `/ui`.
- Place shared UI tokens or utilities in `/styles` or `/design-tokens`.

---

## Galaxy Integration Tips

- **Bookmark**: [https://galaxy.vendasta.com](https://galaxy.vendasta.com)
- Look up:
  - [Foundations](https://galaxy.vendasta.com/foundations/) for colors, spacing, and typography
  - [Components](https://galaxy.vendasta.com/components/) for standardized UI elements
  - [Layouts](https://galaxy.vendasta.com/layouts/) for responsive and structural guidance
- If no matching component is found, suggest a candidate in a PR comment for future Galaxy inclusion.

