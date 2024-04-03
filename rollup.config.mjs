import typescript from "@rollup/plugin-typescript"
import commonjs from "@rollup/plugin-commonjs"
import { nodeResolve } from "@rollup/plugin-node-resolve"

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.cjs",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/index.mjs",
        format: "es",
        sourcemap: true,
      },
    ],
    plugins: [typescript(), commonjs(), nodeResolve()],
    external: [/node_modules/, "tslib"],
  },
  {
    input: "src/internal.ts",
    output: [
      {
        file: "dist/internal.cjs",
        format: "cjs",
      },
      {
        file: "dist/internal.mjs",
        format: "es",
      },
    ],
    plugins: [typescript(), commonjs(), nodeResolve()],
    external: [/node_modules/, "tslib"],
  },
]
