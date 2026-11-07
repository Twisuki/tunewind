import { fileURLToPath } from "node:url"
import { defineConfig } from "tsdown"

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  minify: undefined,
  sourcemap: undefined,
  tsconfig: "tsconfig.build.json",
  alias: {
    "@": fileURLToPath(new URL("./src", import.meta.url)),
  },
  exports: {
    packageJson: true,
  },
})
