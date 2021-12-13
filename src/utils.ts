import { DynamicMap } from "@samual/lib"
import { SourceMapConsumer } from "source-map"

export const Returns = {
	0: "ok",
	"-1": "not owner",
	"-2": "no path",
	"-3": "name exists",
	"-4": "busy",
	"-5": "not found",
	"-6": "not enough",
	"-7": "invalid target",
	"-8": "full",
	"-9": "not in range",
	"-10": "invalid args",
	"-11": "tired",
	"-12": "no bodypart",
	"-14": "RCL not enough",
	"-15": "GCL not enough",
}

export function log(message: string) {
	console.log(colourTextLightGrey(message))
}

export namespace log {
	export function info(message: string) {
		message = colourTextLightGreen(message)

		console.log(message)
		Game.notify(`[${Game.time}] ${message}`, 480)
	}

	export function warn(message: string) {
		message = colourTextLightOrange(message)

		console.log(message)
		Game.notify(`[${Game.time}] ${message}`, 480)
	}

	export function error(message: string) {
		message = colourTextLightRed(message)

		console.log(message)
		Game.notify(`[${Game.time}] ${message}`, 480)
	}
}

export function colourTextRed(text: string) {
	return `<span style="color: rgb(255, 0, 0)">${text}</span>`
}

export function colourTextLightRed(text: string) {
	return `<span style="color: rgb(255, 127, 127)">${text}</span>`
}

export function colourTextGreen(text: string) {
	return `<span style="color: rgb(0, 255, 0)">${text}</span>`
}

export function colourTextLightGreen(text: string) {
	return `<span style="color: rgb(127, 255, 127)">${text}</span>`
}

export function colourTextBlue(text: string) {
	return `<span style="color: rgb(0, 0, 255)">${text}</span>`
}

export function colourTextLightBlue(text: string) {
	return `<span style="color: rgb(127, 127, 255)">${text}</span>`
}

export function colourTextYellow(text: string) {
	return `<span style="color: rgb(255, 255, 0)">${text}</span>`
}

export function colourTextLightYellow(text: string) {
	return `<span style="color: rgb(255, 255, 127)">${text}</span>`
}

export function colourTextOrange(text: string) {
	return `<span style="color: rgb(255, 127, 0)">${text}</span>`
}

export function colourTextLightOrange(text: string) {
	return `<span style="color: rgb(255, 191, 127)">${text}</span>`
}

export function colourTextGrey(text: string) {
	return `<span style="color: rgb(127, 127, 127)">${text}</span>`
}

export function colourTextLightGrey(text: string) {
	return `<span style="color: rgb(191, 191, 191)">${text}</span>`
}

export function getCallstack() {
	return parseCallstack(mapError(new Error().stack!)).slice(1)
}

// export function logReturnCode(returnCode: ScreepsReturnCode) {
// 	log(Returns[returnCode], { notify: 60 * 8, colour: [ 255, 165, 0 ], location: true, type: "warn" })
// }

export function parseCallstack(stack: string) {
	return stack.split("\n").slice(1).map(line => ({
		name: line.split(/\s+/)[2],
		location: /\(([^(]+?)\)/.exec(line)?.[0][1]
	}))
}

export function* ticks<O extends { id: Id<O> }, R = O>({ id }: O, callback?: (object: O) => R) {
	let object

	while (object = Game.getObjectById(id))
		yield callback ? callback(object) : object
}

export function mapError(error: Error | string): string {
	const stack = error instanceof Error
		? error.stack!
		: error

	return error.toString().split("\n")[0] + mapError.cache.get(stack)
}

export namespace mapError {
	let consumer: SourceMapConsumer | undefined

	export const cache = new DynamicMap<string, string>(stack => {
		const regex = /^\s+at\s+(.+?\s+)?\(?([0-z._\-\\\/]+):(\d+):(\d+)\)?$/gm
		let match
		let o = ""

		while (match = regex.exec(stack)) {
			if (match[2] === "main") {
				const pos = getConsumer().originalPositionFor({
					column: Number(match[4]),
					line: Number(match[3])
				})

				if (pos.line != null) {
					if (pos.name) {
						o += `\n    at ${pos.name} (${pos.source}:${pos.line}:${pos.column})`
					} else {
						if (match[1]) {
							// no original source file name known - use file name from given trace
							o += `\n    at ${match[1]} (${pos.source}:${pos.line}:${pos.column})`
						} else {
							// no original source file name known or in given trace - omit name
							o += `\n    at ${pos.source}:${pos.line}:${pos.column}`
						}
					}
				} else {
					// no known position
					break
				}
			} else {
				// no more parseable lines
				break
			}
		}

		return o
	})

	function getConsumer() {
		return consumer = consumer || new SourceMapConsumer(require("./main.js.map"))
	}
}

export function wrap(function_: () => void) {
	return () => {
		try {
			function_()
		} catch (error) {
			if (error instanceof Error) {
				let message

				if ("sim" in Game.rooms)
					message = `Source maps don't work in the simulator - displaying original error\n${_.escape(error.stack)}`
				else
					message = _.escape(mapError(error))

				throw { message }
			} else
				throw error
		}
	}
}
