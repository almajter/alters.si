// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // One page: inline the CSS instead of a render-blocking request.
  build: { inlineStylesheets: 'always' },
});
