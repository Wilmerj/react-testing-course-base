import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    coverage: {
      exclude: [
        "**/*.config.ts",
        "**/*.config.js",
        "**/*.type.ts",
        "**/*.d.ts",
        "**/types",
        "dist/assets",
        "**/App.tsx",
        "**/main.tsx",
      ],
      thresholds: {
        functions: 85
      }
    },
  },
});
