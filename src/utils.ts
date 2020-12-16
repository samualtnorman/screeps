import { MapD } from "./lib"

export const returns = {
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

export function log(message: string, red: number, green: number, blue: number) {
	const [ , type, functionName ] = getCallstack()
	const [ colourString, lightColourString ] = log.colourCache.getD([ red, green, blue ].join())

	console.log(`[${Game.time}] ${colour(`[${type}]`, colourString)} ${colour(`${functionName}:`, "grey")}\t${colour(message, lightColourString)}`)
}

export namespace log {
	export const colourCache = new MapD<string, [ string, string ]>(key => {
		const [ red, green, blue ] = key.split(",").map(Number)

		return [ cssFunction("rgb", red, green, blue), cssFunction("rgb", lerp(red, 0.4, 255), lerp(green, 0.4, 255), lerp(blue, 0.4, 255)) ]
	})
}

export function info(message: string) {
	log(message, 0, 128, 0)
}

export function warn(message: string) {
	Game.notify(message, 60 * 8)
	log(message, 255, 165, 0)
}

export function error(message: string) {
	Game.notify(message, 60)
	log(message, 255, 0, 0)
}

export function colour(message: string, colour: string) {
	return `<span style="color: ${colour}">${message}</span>`
}

export function getCallstack() {
	return new Error().stack!.split("\n").slice(2).map(a => a.split(/\s+/)[2].split(".").pop())
}

export function cssFunction(name: string, ...args: (boolean | number | string)[]) {
	return `${name}(${args.join(", ")})`
}

export function lerp(start: number, amount: number, end: number) {
	return (1 - amount) * start + amount * end
}
