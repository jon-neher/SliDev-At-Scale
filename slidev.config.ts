// @ts-ignore
import { defineConfig } from 'slidev/config'

export default defineConfig({
  theme: {
    root: './theme/vendasta',
  },
  setup({ themeDefaults }) {
    // Frontmatter like `bg-num: 1` is automatically exposed as `data-bg-num="1"` on each slide.
    // This allows dynamic background styling using CSS attribute selectors.

    // Optionally, we could enhance this setup to randomly assign `bg-num`
  // when it is not provided, allowing dynamic variation of slide backgrounds.
  // This would require preprocessing the slides or injecting values at runtime.
  },
});
  