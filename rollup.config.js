import babel from "@rollup/plugin-babel"
import commonJS from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import nodeResolve from "@rollup/plugin-node-resolve"
import screeps from "rollup-plugin-screeps"

/** @typedef {import("rollup").RollupOptions} RollupOptions */

/** @type {RollupOptions} */
const config = {
	input: "src/main.ts",
	output: {
		file: "dist/main.js",
		interop: "auto",
		format: "cjs",
		sourcemap: true,
		sourcemapPathTransform: relativeSourcePath => relativeSourcePath.slice(3),
		intro: "{",
		outro: "}",
		generatedCode: "es2015",
		esModule: false
	},
	plugins: [
		babel({
			babelHelpers: "bundled",
			extensions: [ ".ts" ]
		}),
		commonJS(),
		json({ preferConst: true }),
		nodeResolve({ extensions: [ ".ts" ], rootDir: "src" }),
		screeps({ config: "./screeps.config.json" })
	],
	treeshake: { moduleSideEffects: "no-external" }
}

export default config
