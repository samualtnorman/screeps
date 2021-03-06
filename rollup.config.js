"use strict"

// import resolve from "@rollup/plugin-node-resolve"
// import commonjs from "@rollup/plugin-commonjs"
// import typescript from "@rollup/plugin-typescript"
import screeps from "rollup-plugin-screeps"

let config

const { DEST } = process.env

if (!DEST)
	console.log("No destination specified - code will be compiled but not uploaded")
else if (!(config = require("./screeps.json")[DEST])) {
	console.log("Invalid upload destination")
	process.exit()
}

export default {
	input: "./src/main.ts",
	output: {
		file: "./dist/main.js",
		format: "cjs",
		sourcemap: true,
		sourcemapPathTransform(relativeSourcePath) {
			return relativeSourcePath.slice(3)
		}
	},
	plugins: [
		// resolve(),
		// commonjs(),
		// typescript(),
		// screeps({
		// 	dryRun: true,//!config,
		// 	config
		// })
	]
}
