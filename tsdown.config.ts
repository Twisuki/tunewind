import { fileURLToPath } from "node:url"
import { defineConfig } from "tsdown"

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm", "cjs"],
  exports: false,
  dts: true,
  clean: true,
  minify: undefined,
  sourcemap: undefined,
  tsconfig: "tsconfig.build.json",
  alias: {
    "@": fileURLToPath(new URL("./src", import.meta.url)),
  },
})
