import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    timeout: 60000, // 60 seconds for tests that need to start the dev server
    testTimeout: 30000, // 30 seconds for individual tests
  },
});