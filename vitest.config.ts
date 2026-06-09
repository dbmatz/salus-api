import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: [
      { find: "@domain", replacement: path.join(__dirname, "src/domain") },
      { find: "@app", replacement: path.join(__dirname, "src/application") },
      { find: "@infra", replacement: path.join(__dirname, "src/infra") },
      { find: "@http", replacement: path.join(__dirname, "src/http") },
    ],
  },
});
