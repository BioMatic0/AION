import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

function resolvePath(relativePath: string) {
  return fileURLToPath(new URL(relativePath, import.meta.url));
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@aion/shared-types": resolvePath("../../packages/shared-types/src"),
      "@aion/ui": resolvePath("../../packages/ui/src")
    }
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["test/**/*.test.ts", "test/**/*.test.tsx"]
  }
});
