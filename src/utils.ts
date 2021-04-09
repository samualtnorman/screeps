import { mapError } from "./error-mapper"
import { DynamicMap, cssFunction, lerp, matches } from "./lib"

export const Returns = {
	0: "ok",
	[-1]: "not owner",
	[-2]: "no path",
	[-3]: "name exists",
	[-4]: "busy",
	[-5]: "not found",
	[-6]: "not enough",
	[-7]: "invalid target",
	[-8]: "full",
	[-9]: "not in range",
	[-10]: "invalid args",
	[-11]: "tired",
	[-12]: "no bodypart",
	[-14]: "RCL not enough",
	[-15]: "GCL not enough",
}

export function log(
	message: string,
	{
		notify,
		colour: [ red, green, blue ] = [ 255, 255, 255 ],
		callstackSkips = 2,
		location = false,
		type = "log"
	}: {
		notify?: number,
		colour?: [ number, number, number ],
		callstackSkips?: number,
		location?: boolean,
		type?: string
	} = {}
) {
	const [ { name: functionName, location: location_ } ] = getCallstack().slice(callstackSkips)
	const [ colourString, lightColourString ] = log.colourCache.get([ red, green, blue ].join())

	message = `[${Game.time}] ${colour(`[${type}]`, colourString)} ${colour(`${functionName}:`, "grey")}\t${colour(message, lightColourString)}`

	if (location)
		message += `\t${location_}`

	if (notify != undefined)
		Game.notify(message, notify)

	console.log(message)
}

export namespace log {
	export const colourCache = new DynamicMap<string, [ string, string ]>(key => {
		const [ red, green, blue ] = key.split(",").map(Number)

		return [ cssFunction("rgb", red, green, blue), cssFunction("rgb", lerp(red, 0.4, 255), lerp(green, 0.4, 255), lerp(blue, 0.4, 255)) ]
	})
}

export function info(...message: string[]) {
	log(message.join(" "), { colour: [ 0, 128, 0 ], type: "info" })
}

export function warn(...message: string[]) {
	log(message.join(" "), { notify: 60 * 8, colour: [ 255, 165, 0 ], type: "warn" })
}

export function error(...message: string[]) {
	log(message.join(" "), { notify: 60, colour: [ 0, 128, 0 ], type: "error" })
}

export function colour(message: string, colour: string) {
	return `<span style="color: ${colour}">${message}</span>`
}

export function getCallstack() {
	return parseCallstack(mapError(new Error().stack!)).slice(1)
}

export function logReturnCode(returnCode: ScreepsReturnCode) {
	log(Returns[returnCode], { notify: 60 * 8, colour: [ 255, 165, 0 ], location: true, type: "warn" })
}

export function parseCallstack(stack: string) {
	return stack.split("\n").slice(1).map(line => ({
		name: line.split(/\s+/)[2],
		location: [ ...matches(/\(([^(]+?)\)/, line) ][0]?.[1]
	}))
}

export function* ticks<O extends { id: Id<O> }, R = O>({ id }: O, callback?: (object: O) => R) {
	let object

	while (object = Game.getObjectById(id))
		yield callback ? callback(object) : object
}
